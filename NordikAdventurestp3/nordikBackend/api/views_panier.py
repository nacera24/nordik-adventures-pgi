
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Client, Produit, Panier, itemPanier
from .serializers import PanierSerializer


def build_panier_response(request, panier):
    data = PanierSerializer(panier, context={"request": request}).data
    return {
        "id_panier": data["id"],
        "items": data["items"],
    }


def load_panier_full(panier_id: int) -> Panier:
    # charge items + produit en une fois 
    return Panier.objects.prefetch_related("items__produit").get(id=panier_id)


@api_view(["GET"])
def panier_client(request, userId):
    """
    GET /api/paniers/client/{userId}/
    """
    try:
        client = Client.objects.select_related("panier").get(id=userId)
    except Client.DoesNotExist:
        return Response({"detail": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)

    # sécurité: si panier null, on le crée
    if client.panier is None:
        panier = Panier.objects.create()
        client.panier = panier
        client.save()
    else:
        panier = client.panier

    panier = load_panier_full(panier.id)
    return Response(build_panier_response(request, panier), status=status.HTTP_200_OK)

@api_view(["POST"])
def panier_client_add_item(request, userId):
    try:
        client = Client.objects.select_related("panier").get(id=userId)
    except Client.DoesNotExist:
        return Response({"detail": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)

    if client.panier is None:
        panier = Panier.objects.create()
        client.panier = panier
        client.save()
    else:
        panier = client.panier

    produit_id = request.data.get("produit_id")
    quantite = request.data.get("quantite", 1)

    if not produit_id:
        return Response({"detail": "produit_id est requis."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        quantite = int(quantite)
        if quantite <= 0:
            raise ValueError()
    except Exception:
        return Response({"detail": "quantite invalide (doit être > 0)."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        produit = Produit.objects.get(id=produit_id)
    except Produit.DoesNotExist:
        return Response({"detail": "Produit introuvable."}, status=status.HTTP_404_NOT_FOUND)

    item, _ = itemPanier.objects.get_or_create(
        panier=panier,
        produit=produit,
        defaults={"quantite": 0},
    )

    # quantité qu'on ajoute vraiment
    difference_ajoutee = quantite

    # vérifier le stock disponible
    if difference_ajoutee > produit.quantite_dispo:
        return Response(
            {"detail": f"Stock insuffisant. Disponible : {produit.quantite_dispo}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    #  diminuer stock + augmenter item
    produit.quantite_dispo -= difference_ajoutee
    produit.save()

    item.quantite += difference_ajoutee
    item.save()

    panier = load_panier_full(panier.id)
    return Response(build_panier_response(request, panier), status=status.HTTP_200_OK)


@api_view(["PATCH", "DELETE"])
def panier_item_detail(request, itemId):
    """
    PATCH  /api/paniers/items/{itemId}/  body: { quantite }
    DELETE /api/paniers/items/{itemId}/
    """
    try:
        item = itemPanier.objects.select_related("panier", "produit").get(id=itemId)
    except itemPanier.DoesNotExist:
        return Response({"detail": "Item introuvable."}, status=status.HTTP_404_NOT_FOUND)

    panier = item.panier
    produit = item.produit

    #  DELETE : supprimer l'item → rendre TOUTE la quantité au stock
    if request.method == "DELETE":
        produit.quantite_dispo += item.quantite
        produit.save()

        item.delete()

        panier = load_panier_full(panier.id)
        return Response(build_panier_response(request, panier), status=status.HTTP_200_OK)

    #  PATCH : modifier quantité
    quantite = request.data.get("quantite")
    if quantite is None:
        return Response({"detail": "quantite est requis."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        quantite = int(quantite)
    except Exception:
        return Response({"detail": "quantite invalide."}, status=status.HTTP_400_BAD_REQUEST)

    ancienne_quantite = item.quantite
    difference = quantite - ancienne_quantite

    #  quantite <= 0 → suppression + restitution totale
    if quantite <= 0:
        produit.quantite_dispo += ancienne_quantite
        produit.save()

        item.delete()

        panier = load_panier_full(panier.id)
        return Response(build_panier_response(request, panier), status=status.HTTP_200_OK)

    #  augmentation → vérifier stock
    if difference > 0:
        if difference > produit.quantite_dispo:
            return Response(
                {"detail": f"Stock insuffisant. Disponible : {produit.quantite_dispo}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        produit.quantite_dispo -= difference

    #  diminution → rendre la différence au stock
    elif difference < 0:
        produit.quantite_dispo += abs(difference)

    produit.save()

    item.quantite = quantite
    item.save()

    panier = load_panier_full(panier.id)
    return Response(build_panier_response(request, panier), status=status.HTTP_200_OK)


@api_view(["DELETE"])
def panier_vider(request, panierId):
    """
    DELETE /api/paniers/{id_panier}/items/
    """
    try:
        panier = Panier.objects.get(id=panierId)
    except Panier.DoesNotExist:
        return Response({"detail": "Panier introuvable."}, status=status.HTTP_404_NOT_FOUND)

    panier.items.all().delete()

    panier = load_panier_full(panier.id)
    return Response(build_panier_response(request, panier), status=status.HTTP_200_OK)
