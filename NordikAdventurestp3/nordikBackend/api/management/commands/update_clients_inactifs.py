from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import Client

class Command(BaseCommand):
    help = "Met les clients inactifs si aucune activité depuis 12 mois"

    def handle(self, *args, **options):
        limite = timezone.now() - timedelta(days=365)

        nb = Client.objects.filter(
            derniere_activite__isnull=False,
            derniere_activite__lt=limite
        ).exclude(statut="inactif").update(statut="inactif")

        self.stdout.write(self.style.SUCCESS(f"{nb} clients passés à INACTIF."))
