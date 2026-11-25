"""Crée / réaffirme les comptes admin et agent pour la démo (local + Render)."""

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.accounts.models import StaffProfile

# Identifiants de démo — documentés dans README.md (à changer hors démo publique)
DEMO_ADMIN_USERNAME = "admin"
DEMO_ADMIN_EMAIL = "admin@ambadrcor.local"
DEMO_ADMIN_PASSWORD = "AdminChangeMe!2026"

DEMO_AGENT_EMAIL = "agent@ambadrcor.local"
DEMO_AGENT_PASSWORD = "AgentChangeMe!2026"


def ensure_demo_staff_accounts() -> dict[str, bool]:
    """
    Idempotent : recrée / met à jour admin Django + agent back-office.
    À appeler au boot Render pour que les identifiants survivent au reset SQLite.
    """
    admin, admin_created = User.objects.get_or_create(
        username=DEMO_ADMIN_USERNAME,
        defaults={
            "email": DEMO_ADMIN_EMAIL,
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
        },
    )
    admin.email = DEMO_ADMIN_EMAIL
    admin.is_staff = True
    admin.is_superuser = True
    admin.is_active = True
    admin.set_password(DEMO_ADMIN_PASSWORD)
    admin.save()
    StaffProfile.objects.update_or_create(
        user=admin,
        defaults={
            "role": StaffProfile.Role.ADMIN,
            "display_name": "Administrateur",
        },
    )

    agent, agent_created = User.objects.get_or_create(
        username=DEMO_AGENT_EMAIL,
        defaults={
            "email": DEMO_AGENT_EMAIL,
            "is_staff": True,
            "is_superuser": False,
            "is_active": True,
        },
    )
    agent.email = DEMO_AGENT_EMAIL
    agent.is_staff = True
    agent.is_active = True
    agent.set_password(DEMO_AGENT_PASSWORD)
    agent.save()
    StaffProfile.objects.update_or_create(
        user=agent,
        defaults={
            "role": StaffProfile.Role.ADMIN,
            "display_name": "Agent Ambassade",
        },
    )

    # Tout autre superuser Django reste admin back-office.
    for other in User.objects.filter(is_superuser=True).exclude(pk=admin.pk):
        other.is_staff = True
        other.save(update_fields=["is_staff"])
        StaffProfile.objects.update_or_create(
            user=other,
            defaults={
                "role": StaffProfile.Role.ADMIN,
                "display_name": other.get_full_name() or other.username or "Administrateur",
            },
        )

    return {"admin_created": admin_created, "agent_created": agent_created}


class Command(BaseCommand):
    help = "Crée / met à jour admin Django + agent back-office (démo)."

    def handle(self, *args, **options):
        result = ensure_demo_staff_accounts()
        admin_action = "créé" if result["admin_created"] else "mis à jour"
        agent_action = "créé" if result["agent_created"] else "mis à jour"
        self.stdout.write(
            self.style.SUCCESS(
                f"Admin {admin_action} : {DEMO_ADMIN_USERNAME} / {DEMO_ADMIN_PASSWORD}"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Agent {agent_action} : {DEMO_AGENT_EMAIL} / {DEMO_AGENT_PASSWORD} (rôle admin)"
            )
        )
