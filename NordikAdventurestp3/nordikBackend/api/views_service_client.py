from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Client, Activite, Employe
from .serializers import ClientMiniSerializer, ActiviteSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes




@api_view(["GET"])
def crm_liste_clients(request):
    clients = Client.objects.all().order_by("nom")
    return Response(ClientMiniSerializer(clients, many=True).data)



@api_view(["GET"])
def crm_client_detail(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return Response({"detail": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)

    activites = Activite.objects.filter(client=client).order_by("-dateActivite")

    return Response({
        "client": ClientMiniSerializer(client).data,
        "activites": ActiviteSerializer(activites, many=True).data
    })





@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def crm_ajouter_activite(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return Response({"detail": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)

    employe_id = request.data.get("employe_id")
    employe = None
    if employe_id:
        employe = Employe.objects.filter(id=employe_id).first()

    type_act = request.data.get("type", "NOTE")
    description = request.data.get("description", "")
    page_url = request.data.get("page_url")
    commande_id = request.data.get("commande_client")
    fichier = request.FILES.get("fichier")

    activite = Activite.objects.create(
        client=client,
        employe=employe,
        type=type_act,
        description=description,
        page_url=page_url,
        commande_client_id=commande_id if commande_id else None,
        fichier=fichier,
        dateActivite=timezone.now()
    )

    # mettre à jour derniere_activite client (CRM)
    client.derniere_activite = timezone.now()
    client.save(update_fields=["derniere_activite"])

    return Response(ActiviteSerializer(activite).data, status=status.HTTP_201_CREATED)
