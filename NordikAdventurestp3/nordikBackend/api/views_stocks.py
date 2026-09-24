from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from .models import Produit


from .serializers import ProduitSerializer
#Requetes API - Gestion STOCK -
@api_view(['GET'])
def valeur_totale_stock(request):
    return Response({"message": "Retourne la valeur totale du stock disponible"})



@api_view(["GET"])
def produits_a_reapprovisionner(request):
    qs = Produit.objects.filter(quantite_dispo__lte=models.F("seuilReapprovisionnement"))
    data = ProduitSerializer(qs, many=True, context={"request": request}).data
    return Response(data, status=status.HTTP_200_OK)
