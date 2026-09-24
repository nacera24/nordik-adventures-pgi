from rest_framework.decorators import api_view
from rest_framework.response import Response
@api_view(['PUT'])
def maj_facture(request, idFacture):
    return Response({"message": "Mets A jour inventaire apres-vente"})

@api_view(['GET'])
def get_historique_mvmt(request):
    return Response({"message": "Retourne un historique des sorties et entrees de produits"})

@api_view(['GET'])
def test(request):
    return Response({"message": "!! Test Command !!"})