import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Produit, Fournisseur

def to_float(x: str) -> float:
    return float(x.replace(" ", "").replace("$", "").replace(",", ".").strip())

def to_int(x: str) -> int:
    return int(float(x.replace(" ", "").replace(",", ".").strip()))

class Command(BaseCommand):
    help = "Importer les produits depuis un CSV"

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, "data", "produits.csv")
        with open(csv_path, newline="", encoding="utf-8-sig") as csvfile:
            reader = csv.reader(csvfile, delimiter=";")
            next(reader, None)  # sauter l'entête 

            for row in reader:
                if not row or len(row) < 17:
                    continue

                sku = row[0].strip()
                categorie = row[1].strip()
                nom = row[2].strip()

                cout = to_float(row[3])
                prix = to_float(row[4])

                quantite = to_int(row[6])
                seuil = to_int(row[7])
                stock_min = to_int(row[8])
                delai = to_int(row[9])

                fournisseur_nom = row[10].strip()

                statut_csv = row[16].strip().lower()
                statut = "actif" if statut_csv == "actif" else "inactif"

                fournisseur, _ = Fournisseur.objects.get_or_create(nom=fournisseur_nom)

                image_path = f"produits/{sku}.jpg"
                image_exists = os.path.exists(os.path.join(settings.MEDIA_ROOT, image_path))

                produit, created = Produit.objects.update_or_create(
                    sku=sku,
                    defaults={
                        "nom": nom,
                        "categorieProduit": categorie,
                        "coutAchat": cout,
                        "prixVente": prix,
                        "quantite_dispo": quantite,
                        "seuilReapprovisionnement": seuil,
                        "stockMinimum": stock_min,
                        "delaiLivraison": delai,
                        "statut": statut,
                        "fournisseur": fournisseur,
                        "image": image_path if image_exists else None,
                    }
                )

                action = "créé" if created else "mis à jour"
                self.stdout.write(self.style.SUCCESS(f"✔ Produit {action} : {sku} - {nom}"))
