"""Crée un agent staff de démo pour le back-office."""

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.accounts.models import StaffProfile


class Command(BaseCommand):
    help = "Crée / met à jour un compte agent back-office (dev)."

    def handle(self, *args, **options):
        email = "agent@ambadrcor.local"
        password = "AgentChangeMe!2026"
        user, created = User.objects.get_or_create(
            username=email,
            defaults={"email": email, "is_staff": True, "is_superuser": False},
        )
        user.email = email
        user.is_staff = True
        user.set_password(password)
        user.save()
        StaffProfile.objects.update_or_create(
            user=user,
            defaults={"role": StaffProfile.Role.ADMIN, "display_name": "Agent Ambassade"},
        )

        # Tout superuser Django devient admin back-office.
        for admin in User.objects.filter(is_superuser=True):
            admin.is_staff = True
            admin.save(update_fields=["is_staff"])
            StaffProfile.objects.update_or_create(
                user=admin,
                defaults={
                    "role": StaffProfile.Role.ADMIN,
                    "display_name": admin.get_full_name() or admin.username or "Administrateur",
                },
            )

        action = "créé" if created else "mis à jour"
        self.stdout.write(self.style.SUCCESS(f"Agent {action} : {email} / {password} (rôle admin)"))
