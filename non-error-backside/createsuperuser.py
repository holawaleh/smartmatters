# accounts/management/commands/createsu.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create a superuser without input prompts'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "adminpass")
            self.stdout.write(self.style.SUCCESS("Superuser created"))
