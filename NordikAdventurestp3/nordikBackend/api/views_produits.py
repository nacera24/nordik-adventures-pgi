
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Produit,  Fournisseur
from .serializers import ProduitSerializer


# =========================
# GET LIST
# =========================
@api_view(["GET"])
def get_produits(request):
    produits = Produit.objects.select_related("fournisseur").all()
    serializer = ProduitSerializer(produits, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# =========================
# GET DETAIL
# =========================
@api_view(["GET"])
def get_produit(request, idProduit):
    try:
        produit = Produit.objects.select_related("fournisseur").get(id=idProduit)
    except Produit.DoesNotExist:
        return Response({"detail": "Produit introuvable"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProduitSerializer(produit, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# =========================
# POST CREATE
# =========================
@api_view(["POST"])
def creer_produit(request):
    serializer = ProduitSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        produit = serializer.save()
        return Response(
            ProduitSerializer(produit, context={"request": request}).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# PUT / PATCH UPDATE
# =========================
@api_view(["PUT", "PATCH"])
def modifier_produit(request, idProduit):
    try:
        produit = Produit.objects.get(id=idProduit)
    except Produit.DoesNotExist:
        return Response({"detail": "Produit introuvable"}, status=status.HTTP_404_NOT_FOUND)

    partial = request.method == "PATCH"
    serializer = ProduitSerializer(
        produit,
        data=request.data,
        partial=True,
        context={"request": request},
    )

    if serializer.is_valid():
        produit = serializer.save()
        return Response(
            ProduitSerializer(produit, context={"request": request}).data,
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# DELETE
# =========================
@api_view(["DELETE"])
def effacer_produit(request, idProduit):
    try:
        produit = Produit.objects.get(id=idProduit)
    except Produit.DoesNotExist:
        return Response({"detail": "Produit introuvable"}, status=status.HTTP_404_NOT_FOUND)

    produit.delete()
    return Response({"message": "Produit supprimé"}, status=status.HTTP_200_OK)




@api_view(["GET"])
def get_produits_par_fournisseur(request, idFournisseur):
    if not Fournisseur.objects.filter(id=idFournisseur).exists():
        return Response({"detail": "Fournisseur introuvable."}, status=status.HTTP_404_NOT_FOUND)

    produits = Produit.objects.select_related("fournisseur").filter(fournisseur_id=idFournisseur)
    serializer = ProduitSerializer(produits, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)
