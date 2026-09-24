from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import CommandeClient
from .serializers import CommandeClientSerializer


@api_view(["GET"])
def commandes_clients_a_traiter(request):
    """
    Commandes visibles par le magasinier
    PAYEE = nouvelle commande
    PREPARATION = en cours
    """
    qs = CommandeClient.objects.all().order_by("-id")


    data = CommandeClientSerializer(qs, many=True).data
    return Response(data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
def changer_statut_commande_client(request, commande_id):
    try:
        cmd = CommandeClient.objects.get(id=commande_id)
    except CommandeClient.DoesNotExist:
        return Response({"detail": "Commande introuvable."}, status=status.HTTP_404_NOT_FOUND)

    statut = request.data.get("statut")
    STATUTS_AUTORISES = ["PREPARATION", "EXPEDIEE", "FERMEE"]

    if statut not in STATUTS_AUTORISES:
        return Response({"detail": "Statut invalide."}, status=status.HTTP_400_BAD_REQUEST)

    cmd.statut = statut

    if statut == "PREPARATION" and cmd.date_preparation is None:
        cmd.date_preparation = timezone.now()

    if statut == "EXPEDIEE" and cmd.date_expedition is None:
        cmd.date_expedition = timezone.now()

    if statut == "FERMEE" and cmd.date_fermeture is None:
        cmd.date_fermeture = timezone.now()

    cmd.save()

  
    return Response(CommandeClientSerializer(cmd).data, status=status.HTTP_200_OK)


@api_view(["GET"])
def commandes_client_liste(request, client_id):
    qs = CommandeClient.objects.filter(client_id=client_id).order_by("-id")
    data = CommandeClientSerializer(qs, many=True).data
    return Response(data, status=status.HTTP_200_OK)



@api_view(["GET"])
def commande_client_detail(request, commande_id):
    try:
        cmd = CommandeClient.objects.prefetch_related("items__produit").get(id=commande_id)
    except CommandeClient.DoesNotExist:
        return Response({"detail": "Commande introuvable."}, status=status.HTTP_404_NOT_FOUND)

    return Response(CommandeClientSerializer(cmd).data, status=status.HTTP_200_OK)
