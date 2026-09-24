from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from decimal import Decimal
from .models import Commande, LigneCommande, Produit, Fournisseur, Achat, mouvementStock, PaiementAchat
from .serializers import CommandeSerializer


TPS_RATE = Decimal("0.05")
TVQ_RATE = Decimal("0.09975")

@api_view(["POST"])
def creer_commande_achat(request):
    fournisseur_id = request.data.get("fournisseurId")
    lignes = request.data.get("lignes", [])

    if not fournisseur_id or not lignes:
        return Response(
            {"detail": "fournisseurId et lignes sont requis."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        fournisseur = Fournisseur.objects.get(id=fournisseur_id)
    except Fournisseur.DoesNotExist:
        return Response({"detail": "Fournisseur introuvable."}, status=status.HTTP_404_NOT_FOUND)

    with transaction.atomic():
        commande = Commande.objects.create(statut="EN_ATTENTE")
        Achat.objects.create(fournisseur=fournisseur, commande=commande)

        sous_total = Decimal("0.00")

        for l in lignes:
            produit_id = l.get("produitId")
            qte = int(l.get("quantite") or 0)

            if not produit_id or qte <= 0:
                continue

            try:
                produit = Produit.objects.get(id=produit_id)
            except Produit.DoesNotExist:
                return Response(
                    {"detail": f"Produit introuvable (id={produit_id})."},
                    status=status.HTTP_404_NOT_FOUND
                )

            LigneCommande.objects.create(
                commande=commande,
                produit=produit,
                quantite=qte
            )

            sous_total += (produit.coutAchat * qte)

        #  calcul TPS/TVQ + total
        tps = (sous_total * TPS_RATE).quantize(Decimal("0.01"))
        tvq = (sous_total * TVQ_RATE).quantize(Decimal("0.01"))
        total = (sous_total + tps + tvq).quantize(Decimal("0.01"))

       
        commande.sous_total = sous_total.quantize(Decimal("0.01"))
        commande.tps = tps
        commande.tvq = tvq
        commande.total = total
        commande.save()

        #  créer paiement achat automatique (EN_ATTENTE)
        PaiementAchat.objects.create(
            commande=commande,
            montant_paye=Decimal("0.00"),
            solde=total,
            statut="EN_ATTENTE",
            mode="carte",
            date=None 
        )

    return Response(CommandeSerializer(commande).data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def liste_commandes_a_recevoir(request):
    commandes = (
        Commande.objects
        .prefetch_related("items__produit")
        .select_related("achat__fournisseur", "paiementAchat") 
        .order_by("-id")
    )
    serializer = CommandeSerializer(commandes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["POST"])
def payer_commande_achat(request, commande_id):
    montant = Decimal(str(request.data.get("montant", "0.00"))).quantize(Decimal("0.01"))
    mode = request.data.get("mode", "carte")

    try:
        paiement = PaiementAchat.objects.select_related("commande").get(commande_id=commande_id)
    except PaiementAchat.DoesNotExist:
        return Response({"detail": "Paiement introuvable."}, status=status.HTTP_404_NOT_FOUND)

    paiement.montant_paye = (paiement.montant_paye + montant).quantize(Decimal("0.01"))
    paiement.solde = (paiement.commande.total - paiement.montant_paye).quantize(Decimal("0.01"))
    paiement.mode = mode

    if paiement.solde <= 0:
        paiement.solde = Decimal("0.00")
        paiement.statut = "PAYE"
    elif paiement.montant_paye > 0:
        paiement.statut = "PARTIEL"
    else:
        paiement.statut = "EN_ATTENTE"
    
    
    #  si on vient de payer (au moins une fois), enregistrer date paiement
    if montant > 0:
     paiement.date = timezone.now()
    paiement.save()
    return Response(CommandeSerializer(paiement.commande).data, status=status.HTTP_200_OK)


@api_view(["POST"])
def receptionner_commande(request, commande_id):
    try:
        commande = (
            Commande.objects
            .select_related("achat__fournisseur")
            .prefetch_related("items__produit")
            .get(id=commande_id)
        )
    except Commande.DoesNotExist:
        return Response({"detail": "Commande introuvable."}, status=status.HTTP_404_NOT_FOUND)

    if commande.statut == "RECEPTIONNEE":
        return Response({"detail": "Commande déjà réceptionnée."}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        for ligne in commande.items.all():
            produit = ligne.produit
            produit.quantite_dispo += ligne.quantite
            produit.save()

            mouvementStock.objects.create(
                quantite=ligne.quantite,
                dateMouvement=timezone.now(),
                estAjout=True,
                motif=f"Réception commande #{commande.id}",
                produit=produit,
            )

        commande.statut = "RECEPTIONNEE"
        commande.date_reception = timezone.now()
        commande.save()

    return Response(
        {"message": "Commande réceptionnée, stock mis à jour."},
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
def detail_commande_achat(request, commande_id):
    try:
        commande = (
            Commande.objects
            .select_related("achat__fournisseur", "paiementAchat")
            .prefetch_related("items__produit")
            .get(id=commande_id)
        )
    except Commande.DoesNotExist:
        return Response({"detail": "Commande introuvable."}, status=status.HTTP_404_NOT_FOUND)

    return Response(CommandeSerializer(commande).data, status=status.HTTP_200_OK)



