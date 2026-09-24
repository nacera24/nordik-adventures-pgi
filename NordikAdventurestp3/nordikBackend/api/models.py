from django.db import models
from django.db import models
from django.utils import timezone
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator


class Fournisseur(models.Model):
    nom = models.CharField(max_length=100)

class Panier(models.Model):
    def nombreItems(self):
        return self.items.count()

class Produit(models.Model):
    ProduitStatus = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif')
    ]
    nom = models.CharField(max_length=100)
    sku = models.CharField(max_length=30, unique=True)
    coutAchat = models.DecimalField(max_digits=10, decimal_places=2)
    statut = models.CharField(choices=ProduitStatus, default='actif', max_length=10)
    seuilReapprovisionnement = models.PositiveIntegerField()
    quantite_dispo = models.PositiveIntegerField()
    stockMinimum = models.PositiveIntegerField()
    prixVente = models.DecimalField(max_digits=10, decimal_places=2)
    categorieProduit = models.CharField(max_length=100)
    delaiLivraison = models.PositiveIntegerField()
    image = models.ImageField(upload_to="produits/", null=True, blank=True)
    fournisseur = models.ForeignKey(
        Fournisseur,
        on_delete=models.CASCADE,
        related_name="produits"
    )
 

class itemPanier(models.Model):
    panier = models.ForeignKey(
        Panier,
        on_delete=models.CASCADE,
        related_name="items"
    )
    produit = models.ForeignKey(
        Produit,
        on_delete=models.PROTECT
    )
    quantite = models.PositiveIntegerField()

    def sousTotalVente(self):
        return self.produit.prixVente * self.quantite

class Utilisateur(models.Model):
    nom = models.CharField(max_length=100)
    nomUtilisateur = models.CharField(max_length=100)
    courriel = models.EmailField()
    password = models.CharField(max_length=100)
    panier = models.OneToOneField(
        Panier, 
        on_delete=models.SET_NULL, 
        null=True)
    class Meta:
        abstract = True

class Employe(Utilisateur):
    EmployeRoles = [
        ('comptable', 'Comptable'),
        ('magasinier', 'Magasinier'),
        ('admin', 'Admin'),
        ('gestionnaire', 'Gestionnaire'),
        ('agentclientele', 'Agent du service à la clientèle'),
    ]
    role = models.CharField(choices=EmployeRoles, max_length=30) 


class Client(Utilisateur):
    ClientStatus = [
        ('prospect', 'Prospect'),
        ('actif', 'Actif'),
        ('fidele', 'Fidèle'),
        ('inactif', 'Inactif'),
    ]
    statut = models.CharField(choices=ClientStatus, default='prospect', max_length=10)

    derniere_activite = models.DateTimeField(default=timezone.now)



class mouvementStock(models.Model):
    quantite = models.PositiveIntegerField()
    dateMouvement = models.DateTimeField()
    estAjout = models.BooleanField(default=True)
    motif = models.CharField(max_length=1000)
    produit = models.ForeignKey(
        Produit,
        on_delete=models.CASCADE,
        related_name="mouvements"
    )

class ParametresFiscaux(models.Model):
    codeTaxe = models.CharField(max_length=30)
    taux = models.DecimalField(max_digits=6, decimal_places=5)

class Facture(models.Model):

    statut = models.CharField(max_length=20, default="PAYEE")
    date = models.DateTimeField(default=timezone.now)

    montant_ht = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    montant_taxes = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    montant_ttc = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    ParametresFiscaux = models.ForeignKey(ParametresFiscaux, on_delete=models.SET_NULL, null=True)

class Commande(models.Model):
    STATUTS = [
        ("EN_ATTENTE", "En attente"),
        ("RECEPTIONNEE", "Réceptionnée"),
    ]
    statut = models.CharField(max_length=30, choices=STATUTS, default="EN_ATTENTE")

    # Date de commande (création)
    date_commande = models.DateTimeField(default=timezone.now)

    # Date de réception (quand le magasinier réceptionne)
    date_reception = models.DateTimeField(null=True, blank=True)

    sous_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tps = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tvq = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class Achat(models.Model):
    fournisseur = models.ForeignKey(
        Fournisseur,
        on_delete=models.CASCADE,
        related_name="achats")
    commande = models.OneToOneField(
        Commande,
        on_delete=models.SET_NULL,
        null=True,
         related_name="achat"
    )
    
class PaiementAchat(models.Model):
    STATUTS = [
        ("EN_ATTENTE", "En attente"),
        ("PARTIEL", "Partiel"),
        ("PAYE", "Payé"),
    ]

    commande = models.OneToOneField(
        Commande,
        on_delete=models.CASCADE,
        related_name="paiementAchat"
    )
    date = models.DateTimeField(null=True, blank=True) 
    montant_paye = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    solde = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    statut = models.CharField(max_length=20, choices=STATUTS, default="EN_ATTENTE")
    mode = models.CharField(max_length=50, default="carte")

class Paiement(models.Model):
    date = models.DateTimeField()
    facture = models.ForeignKey(
        Facture,
        on_delete=models.SET_NULL,
        related_name="paiements",
        null=True
    )
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    mode = models.CharField(max_length=50)
    
class LigneCommande(models.Model):
    commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name="items"
    )
    produit = models.ForeignKey(
        Produit,
        on_delete=models.PROTECT
    )
    quantite = models.PositiveIntegerField()
    def sousTotalCout(self):
        return self.produit.coutAchat * self.quantite
     
class LigneFacture(models.Model):
    facture = models.ForeignKey(
        Facture,
        on_delete=models.CASCADE,
        related_name="items"
    )
    produit = models.ForeignKey(
        Produit,
        on_delete=models.PROTECT
    )
    quantite = models.PositiveIntegerField()
    def sousTotalVente(self):
        return self.produit.prixVente * self.quantite
    
class Vente(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL, null=True,
        related_name="ventes"
    )
    facture = models.OneToOneField(
        Facture,
        on_delete=models.SET_NULL,
        null=True
    )



class CommandeClient(models.Model):
    STATUTS = [
        ("PAYEE", "Payée"),
        ("PREPARATION", "En préparation"),
        ("EXPEDIEE", "Expédiée"),
        ("FERMEE", "Fermée"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="commandes_clients"
    )

    facture = models.OneToOneField(
        Facture,
        on_delete=models.CASCADE,
        related_name="commande_client"
    )

    statut = models.CharField(
        max_length=20,
        choices=STATUTS,
        default="PAYEE"
    )

    # Dates de suivi
    date_creation = models.DateTimeField(default=timezone.now)
    date_preparation = models.DateTimeField(null=True, blank=True)
    date_expedition = models.DateTimeField(null=True, blank=True)
    date_fermeture = models.DateTimeField(null=True, blank=True)

class LigneCommandeClient(models.Model):
    commande = models.ForeignKey(
        CommandeClient,
        on_delete=models.CASCADE,
        related_name="items"
    )
    produit = models.ForeignKey(Produit, on_delete=models.PROTECT)
    quantite = models.PositiveIntegerField()

class Satisfaction(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="satisfactions"
    )

    commande = models.OneToOneField(
        CommandeClient,
        on_delete=models.CASCADE,
        related_name="satisfaction"
    )

    note = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    commentaire = models.TextField(null=True, blank=True)
    date_creation = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Satisfaction {self.note}/5 - Client {self.client_id} - Cmd {self.commande_id}"


class Activite(models.Model):
    TYPES = [
        ("VISITE_SITE", "Visite du site"),
        ("VISITE_PAGE", "Visite d'une page"),
        ("COMMANDE", "Commande"),
        ("COURRIEL", "Courriel"),
        ("APPEL", "Appel téléphonique"),
        ("PDF", "Document PDF"),
        ("NOTE", "Note manuelle"),
    ]

    dateActivite = models.DateTimeField(default=timezone.now)

    type = models.CharField(max_length=30, choices=TYPES, default="NOTE")
    description = models.TextField(null=True, blank=True)

    page_url = models.CharField(max_length=500, null=True, blank=True)

    employe = models.ForeignKey(
        Employe,
        on_delete=models.SET_NULL,
        null=True,
        related_name="activites"
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL,
        null=True,
        related_name="activites"
    )

    
    commande_client = models.ForeignKey(
        CommandeClient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activites"
    )

    fichier = models.FileField(upload_to="crm/", null=True, blank=True)

