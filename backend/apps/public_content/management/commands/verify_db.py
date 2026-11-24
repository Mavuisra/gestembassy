"""Échec explicite si la base n'est pas prête (à lancer après migrate + seed)."""

from __future__ import annotations

from django.core.management.base import BaseCommand, CommandError

from infrastructure.db_health import check_database


class Command(BaseCommand):
    help = "Vérifie la connexion DB et la présence des tables contenu public."

    def handle(self, *args, **options):
        health = check_database(require_public_content=True)
        if health.ok:
            self.stdout.write(self.style.SUCCESS(f"DB OK (engine={health.engine})"))
            return
        raise CommandError(
            f"DB indisponible ({health.error_type}): {health.error_message}"
        )
