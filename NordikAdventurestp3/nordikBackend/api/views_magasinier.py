# ton_app/views_magasinier.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import localtime

from .models import Produit, Achat, CommandeClient
from django.db import models


@api_view(["GET"])
def dashboard_magasinier(request):
    """
    Dashboard magasinier :
    - produits sous le seuil
    - commandes fournisseur récentes
    - commandes client récentes
    """

    # -----------------------------
    #  Produits sous le seuil
    # -----------------------------
    produits_qs = (
        Produit.objects
        .select_related("fournisseur")
        .filter(quantite_dispo__lte=0)  # on ajuste plus bas, ceci est juste base
    )

   
    produits_sous_seuil = (
        Produit.objects
        .select_related("fournisseur")
        .filter(quantite_dispo__lte=0)  # placeholder
    )


    produits_sous_seuil = (
        Produit.objects
        .select_related("fournisseur")
        .filter(quantite_dispo__lte=models.F("stockMinimum"))  # stockMinimum
        | Produit.objects.select_related("fournisseur").filter(quantite_dispo__lte=models.F("seuilReapprovisionnement"))
    )

    
    produits_sous_seuil = produits_sous_seuil.distinct().order_by("quantite_dispo")[:20]

    produitsSousSeuil = []
    for p in produits_sous_seuil:
        produitsSousSeuil.append({
            "id_produit": p.id,
            "nom_produit": p.nom,
            "fournisseur": p.fournisseur.nom if p.fournisseur else None,
            "stock_dispo": p.quantite_dispo,
            "stock_min": p.stockMinimum,  # ou p.seuilReapprovisionnement si tu veux
        })

    # -----------------------------
    #  Commandes fournisseur récentes (Achat + Commande)
    # -----------------------------
    achats = (
        Achat.objects
        .select_related("fournisseur", "commande")
        .order_by("-commande__date_commande")[:10]
    )

    commandesFournisseur = []
    for a in achats:
        cmd = a.commande
        commandesFournisseur.append({
            "id": cmd.id if cmd else None,
            "date": localtime(cmd.date_commande).strftime("%Y-%m-%d %H:%M") if cmd and cmd.date_commande else None,
            "fournisseur": a.fournisseur.nom if a.fournisseur else None,
            "total": str(cmd.total) if cmd else "0",
            "statut": cmd.statut if cmd else "EN_ATTENTE",
        })

    # -----------------------------
    #  Commandes client récentes
    # -----------------------------
    commandes_client = (
        CommandeClient.objects
        .select_related("client", "facture")
        .order_by("-date_creation")[:10]
    )

    commandesClient = []
    for c in commandes_client:
        commandesClient.append({
            "id": c.id,
            "date": localtime(c.date_creation).strftime("%Y-%m-%d %H:%M") if c.date_creation else None,
            "client": c.client.nom if c.client else None,
            "total": str(c.facture.montant_ttc) if c.facture else "0",
            "statut": c.statut,
        })

    # -----------------------------
    # KPIs 
    # -----------------------------
    kpis = {
        "stock_total": Produit.objects.count(),
        "nb_produits_sous_seuil": len(produitsSousSeuil),
        "nb_commandes_fournisseur": len(commandesFournisseur),
        "nb_commandes_client": len(commandesClient),
    }

    return Response({
        "kpis": kpis,
        "produitsSousSeuil": produitsSousSeuil,
        "commandesFournisseur": commandesFournisseur,
        "commandesClient": commandesClient,
    })
