
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Fournisseur
from .serializers import FournisseurSerializer


@api_view(["GET"])
def get_fournisseurs(request):
    fournisseurs = Fournisseur.objects.all().order_by("id")
    serializer = FournisseurSerializer(fournisseurs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def creer_fournisseur(request):
    serializer = FournisseurSerializer(data=request.data)
    if serializer.is_valid():
        fournisseur = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "PATCH"])
def modifier_fournisseur(request, idFournisseur):
    try:
        fournisseur = Fournisseur.objects.get(id=idFournisseur)
    except Fournisseur.DoesNotExist:
        return Response({"detail": "Fournisseur introuvable"}, status=status.HTTP_404_NOT_FOUND)

    partial = request.method == "PATCH"
    serializer = FournisseurSerializer(fournisseur, data=request.data, partial=partial)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
