from django.db.models import Sum, Avg
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import CommandeClient, Satisfaction

@api_view(["GET"])
def dashboard_financier(request):

    #  ventes = commandes dont la facture est PAYEE 
    commandes_facture_payee = CommandeClient.objects.filter(facture__statut="PAYEE")

    nbVentes = commandes_facture_payee.count()

    # revenus = somme des factures PAYEES
    totalRevenus = commandes_facture_payee.aggregate(
        total=Sum("facture__montant_ttc")
    )["total"] or 0

    #  statuts commandes client 
    nbPayees = CommandeClient.objects.filter(statut="PAYEE").count()
    nbEnPreparation = CommandeClient.objects.filter(statut="PREPARATION").count()
    nbExpediees = CommandeClient.objects.filter(statut="EXPEDIEE").count()
    nbFermees = CommandeClient.objects.filter(statut="FERMEE").count()

    #  satisfaction moyenne
    satisfactionMoyenne = Satisfaction.objects.aggregate(
        avg=Avg("note")
    )["avg"] or 0

    return Response({
        "nbVentes": nbVentes,
        "totalRevenus": float(totalRevenus),
        "statutsCommandes": {
            "PAYEE": nbPayees,
            "PREPARATION": nbEnPreparation,
            "EXPEDIEE": nbExpediees,
            "FERMEE": nbFermees,
        },
        "satisfactionMoyenne": float(satisfactionMoyenne),
    })
