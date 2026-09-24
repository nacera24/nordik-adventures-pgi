from django.utils import timezone
from django.db.models import Sum
from decimal import Decimal
from datetime import timedelta

from .models import CommandeClient

INACTIF_DELAI_JOURS = 365  # 12 mois

def update_client_statut(client):
    """
    Règles CRM :
    - si aucune activité depuis 12 mois => INACTIF
    - première commande => prospect -> actif
    - si > 5 commandes OU >= 3000$ ventes cumulées => fidèle
    """

    maintenant = timezone.now()

    # 1) RÈGLE INACTIF (prioritaire)
    if client.derniere_activite:
        limite = maintenant - timedelta(days=INACTIF_DELAI_JOURS)
        if client.derniere_activite < limite:
            client.statut = "inactif"
            client.save()
            return  

    # 2) Nombre de commandes
    nb_cmd = CommandeClient.objects.filter(client=client).count()

    # 3) Total des ventes
    total_ventes = CommandeClient.objects.filter(client=client).aggregate(
        total=Sum("facture__montant_ttc")
    )["total"] or Decimal("0.00")

    # 4) Prospect → Actif (première commande)
    if nb_cmd >= 1 and client.statut == "prospect":
        client.statut = "actif"

    # 5) Actif → Fidèle
    if nb_cmd > 5 or total_ventes >= Decimal("3000.00"):
        client.statut = "fidele"

    # 6) Mise à jour activité
    client.derniere_activite = maintenant
    client.save()
