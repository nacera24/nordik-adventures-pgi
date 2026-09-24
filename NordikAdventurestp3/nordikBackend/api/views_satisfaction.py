from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Satisfaction, Client, CommandeClient
from .serializers import SatisfactionSerializer

@api_view(["POST"])
def creer_satisfaction(request):
    data = request.data

    client_id = data.get("client")
    commande_id = data.get("commande")
    note = data.get("note")
    commentaire = data.get("commentaire", None)

    if not client_id or not commande_id or not note:
        return Response(
            {"error": "client, commande et note sont obligatoires"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if int(note) < 1 or int(note) > 5:
        return Response(
            {"error": "La note doit être entre 1 et 5"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        client = Client.objects.get(id=client_id)
        commande = CommandeClient.objects.get(id=commande_id)
    except (Client.DoesNotExist, CommandeClient.DoesNotExist):
        return Response(
            {"error": "Client ou commande introuvable"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if Satisfaction.objects.filter(commande=commande).exists():
        return Response(
            {"error": "Une satisfaction existe déjà pour cette commande"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    satisfaction = Satisfaction.objects.create(
        client=client,
        commande=commande,
        note=note,
        commentaire=commentaire,
    )

    serializer = SatisfactionSerializer(satisfaction)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
