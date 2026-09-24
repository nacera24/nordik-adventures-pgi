from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.utils import timezone
from decimal import Decimal

from .models import (
    Client, Panier, Facture, LigneFacture, Paiement, Vente,
    CommandeClient, LigneCommandeClient
)
from .serializers import FactureSerializer


from .utils_client_statut import update_client_statut

TPS = Decimal("0.05")
TVQ = Decimal("0.09975")


@api_view(["POST"])
def payer_commande_client(request, client_id):
    """
    POST /api/commandes-client/<client_id>/payer/
    """
    try:
        client = Client.objects.select_related("panier").get(id=client_id)
    except Client.DoesNotExist:
        return Response({"detail": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)

    if not client.panier:
        return Response({"detail": "Panier introuvable."}, status=status.HTTP_400_BAD_REQUEST)

    panier = Panier.objects.prefetch_related("items__produit").get(id=client.panier.id)
    if panier.items.count() == 0:
        return Response({"detail": "Votre panier est vide."}, status=status.HTTP_400_BAD_REQUEST)

    mode = request.data.get("mode", "carte")

    with transaction.atomic():
        #  Calcul montants
        montant_ht = Decimal("0.00")
        for it in panier.items.all():
            montant_ht += (it.produit.prixVente * it.quantite)

        montant_ht = montant_ht.quantize(Decimal("0.01"))
        montant_tps = (montant_ht * TPS).quantize(Decimal("0.01"))
        montant_tvq = (montant_ht * TVQ).quantize(Decimal("0.01"))
        montant_taxes = (montant_tps + montant_tvq).quantize(Decimal("0.01"))
        montant_ttc = (montant_ht + montant_taxes).quantize(Decimal("0.01"))

        #  Créer facture
        facture = Facture.objects.create(
            statut="PAYEE",
            date=timezone.now(),
            montant_ht=montant_ht,
            montant_taxes=montant_taxes,
            montant_ttc=montant_ttc,
            ParametresFiscaux=None,
        )

        #  Créer commande client
        commande_client = CommandeClient.objects.create(
            client=client,
            facture=facture,
            statut="PAYEE"
        )

        #  lignes facture + lignes commande client
        for it in panier.items.all():
            LigneFacture.objects.create(
                facture=facture,
                produit=it.produit,
                quantite=it.quantite
            )

            LigneCommandeClient.objects.create(
                commande=commande_client,
                produit=it.produit,
                quantite=it.quantite
            )

        #  Paiement + Vente
        Paiement.objects.create(
            date=timezone.now(),
            facture=facture,
            montant=montant_ttc,
            mode=mode
        )

        Vente.objects.create(client=client, facture=facture)

        #  statut client (Prospect -> Actif -> Fidèle)
        update_client_statut(client)

        #  Vider panier
        panier.items.all().delete()

        data = FactureSerializer(facture).data
        data["commande_id"] = commande_client.id
        return Response(data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def factures_client(request, client_id):
    ventes = (
        Vente.objects
        .select_related("facture")
        .filter(client_id=client_id)
        .order_by("-id")
    )
    factures = [v.facture for v in ventes if v.facture is not None]
    data = FactureSerializer(factures, many=True).data
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
def facture_detail(request, facture_id):
    try:
        facture = Facture.objects.prefetch_related("items__produit").get(id=facture_id)
    except Facture.DoesNotExist:
        return Response({"detail": "Facture introuvable."}, status=status.HTTP_404_NOT_FOUND)

    return Response(FactureSerializer(facture).data, status=status.HTTP_200_OK)
