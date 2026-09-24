from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Client, Employe
from .serializers import ClientRegisterSerializer, LoginSerializer


@api_view(["POST"])
def register_client(request):

    serializer = ClientRegisterSerializer(data=request.data)

    if serializer.is_valid():
        client = serializer.save()
        return Response(
            {
                "message": "Inscription réussie",
                "token": None,
                "user": {
                    "id": client.id,
                    "username": client.courriel,
                    "nom": client.nom,   
                    "role": "client",
                },
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):

    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data["username"].strip().lower()
    password = serializer.validated_data["password"]
    user_type = serializer.validated_data["type"]

    if user_type == "client":
        user = Client.objects.filter(courriel=email).first()
        role = "client"
    else:
        user = Employe.objects.filter(courriel=email).first()
        role = user.role if user else None

    if not user:
        return Response({"detail": "Compte introuvable."}, status=status.HTTP_401_UNAUTHORIZED)

    if user.password != password:
        return Response({"detail": "Mot de passe incorrect."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(
        {
            "token": None,
            "user": {
                "id": user.id,
                "username": user.courriel,
                 "nom": user.nom,   
                "role": role,
            },
        },
        status=status.HTTP_200_OK,
    )
 

@api_view(["GET"])
def client_detail(request, client_id):
    try:
        c = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return Response({"detail": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "id": c.id,
        "nom": c.nom,
        "username": c.courriel,  
    }, status=status.HTTP_200_OK)

