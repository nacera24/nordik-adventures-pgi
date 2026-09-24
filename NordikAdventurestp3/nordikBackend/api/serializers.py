
from rest_framework import serializers

 
from .models import (
    Employe,
    Client,
    Fournisseur,
    Produit,
    Panier,
    Commande,
    LigneCommande,
    PaiementAchat,
    itemPanier,
    Facture,
    LigneFacture,
    CommandeClient,
    LigneCommandeClient,
    Paiement, 
    Vente, 
    Satisfaction,
    Activite,
) 

# =========================
# EMPLOYÉ
# =========================
class EmployeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = ["id", "nom", "nomUtilisateur", "courriel", "role"]

class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = ["id", "nom"]

class ProduitSerializer(serializers.ModelSerializer):
    # lecture : on renvoie {id, nom}
    fournisseur = FournisseurSerializer(read_only=True)

    #  écriture : on accepte fournisseurId
    fournisseurId = serializers.PrimaryKeyRelatedField(
        source="fournisseur",
        queryset=Fournisseur.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )


    image = serializers.ImageField(required=False, allow_null=True)


    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Produit
        fields = [
            "id",
            "sku",
            "nom",
            "coutAchat",
            "prixVente",
            "quantite_dispo",
            "categorieProduit",
            "statut",
            "delaiLivraison",
            "seuilReapprovisionnement",
            "stockMinimum",
            "fournisseur",
            "fournisseurId",
            "image",       # upload
            "image_url",   #  affichage URL
        ]

    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, "url"):
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


# =========================
# INSCRIPTION CLIENT
# =========================
class ClientRegisterSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=100)
    username = serializers.EmailField()
    password = serializers.CharField(max_length=100)

    def validate_username(self, value):
        email = value.strip().lower()

        # empêcher doublons client ou employé avec même email
        if Client.objects.filter(courriel=email).exists() or Employe.objects.filter(courriel=email).exists():
            raise serializers.ValidationError("Ce courriel est déjà utilisé.")
        return email

    def create(self, validated_data):
        email = validated_data["username"].strip().lower()

        # créer un panier vide pour le client
        panier = Panier.objects.create()

        client = Client.objects.create(
            nom=validated_data["nom"].strip(),
            nomUtilisateur=email,
            courriel=email,
            password=validated_data["password"],  
            panier=panier,
            statut="prospect",
        )
        return client


# =========================
# LOGIN
# =========================
class LoginSerializer(serializers.Serializer):
    username = serializers.EmailField()
    password = serializers.CharField(max_length=100)
    type = serializers.ChoiceField(choices=["client", "employe"])

# =========================
# Commande achat produit par financier
# =========================

class LigneCommandeSerializer(serializers.ModelSerializer):
    produitNom = serializers.CharField(source="produit.nom", read_only=True)
    coutAchat = serializers.DecimalField(source="produit.coutAchat", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = LigneCommande
        fields = ["id", "produit", "produitNom", "coutAchat", "quantite"]

class PaiementAchatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementAchat
        fields = ["statut", "solde", "montant_paye", "mode", "date"]

class CommandeSerializer(serializers.ModelSerializer):
    items = LigneCommandeSerializer(many=True, read_only=True)

    # fournisseur via Achat
    fournisseur = serializers.SerializerMethodField()

    #  paiement achat
    paiement = PaiementAchatSerializer(source="paiementAchat", read_only=True)

    class Meta:
        model = Commande
        fields = [
            "id",
            "statut",
            "date_commande",
            "date_reception",
            "fournisseur",
            "items",
            #  montants enregistrés en BD
            "sous_total",
            "tps",
            "tvq",
            "total",
           
            "paiement",
        ]

    def get_fournisseur(self, obj):
        if hasattr(obj, "achat") and obj.achat and obj.achat.fournisseur:
            return {"id": obj.achat.fournisseur.id, "nom": obj.achat.fournisseur.nom}
        return None

# =========================
# Panier client
# =========================

class PanierItemSerializer(serializers.ModelSerializer):
    produit = ProduitSerializer(read_only=True)   

    class Meta:
        model = itemPanier
        fields = ["id", "produit", "quantite"]

class PanierSerializer(serializers.ModelSerializer):
    items = PanierItemSerializer(many=True, read_only=True)

    class Meta:
        model = Panier
        fields = ["id", "items"]
        



class LigneFactureSerializer(serializers.ModelSerializer):
    nom_produit = serializers.CharField(source="produit.nom", read_only=True)
    prix_unitaire = serializers.DecimalField(source="produit.prixVente", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = LigneFacture
        fields = ["id", "produit", "nom_produit", "prix_unitaire", "quantite"]

class FactureSerializer(serializers.ModelSerializer):
    items = LigneFactureSerializer(many=True, read_only=True)

    client_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Facture
        fields = [
            "id",
            "statut",
            "date",
            "montant_ht",
            "montant_taxes",
            "montant_ttc",
            "items",
            "client_id",
        ]
        

class LigneCommandeClientSerializer(serializers.ModelSerializer):
    nom_produit = serializers.CharField(source="produit.nom", read_only=True)
    prix_unitaire = serializers.DecimalField(
        source="produit.prixVente",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    total_ligne = serializers.SerializerMethodField()

    class Meta:
        model = LigneCommandeClient
        fields = [
            "id",
            "produit",
            "nom_produit",
            "prix_unitaire",
            "quantite",
            "total_ligne",
        ]

    def get_total_ligne(self, obj):
        return obj.quantite * obj.produit.prixVente

class CommandeClientSerializer(serializers.ModelSerializer):
    items = LigneCommandeClientSerializer(many=True, read_only=True)
    client_nom = serializers.CharField(source="client.nom", read_only=True)

    facture_id = serializers.IntegerField(source="facture.id", read_only=True)
    montant_ttc = serializers.DecimalField(
        source="facture.montant_ttc",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = CommandeClient
        fields = [
            "id",
            "client",
            "client_nom",
            "facture_id",
            "montant_ttc",
            "statut",
            "date_creation",
            "date_expedition",
            "date_preparation",
            "date_fermeture",
            "items",
        ]


class SatisfactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Satisfaction
        fields = "__all__"


class ClientMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "nom", "courriel", "statut", "derniere_activite"]

class ActiviteSerializer(serializers.ModelSerializer):
    employe_nom = serializers.CharField(source="employe.nom", read_only=True)

    class Meta:
        model = Activite
        fields = [
            "id",
            "dateActivite",
            "type",
            "description",
            "page_url",
            "employe",
            "employe_nom",
            "client",
            "commande_client",
            "fichier",
        ]
