"""Bootstrap DB au démarrage (Render SQLite éphémère / startCommand obsolète)."""

from __future__ import annotations

import logging
from pathlib import Path

from django.conf import settings
from django.core.management import call_command
from django.db import connections

from infrastructure.db_health import check_database

logger = logging.getLogger(__name__)


def _close_db() -> None:
    connections.close_all()


def _is_file_sqlite() -> bool:
    engine = settings.DATABASES["default"]["ENGINE"]
    if "sqlite3" not in engine:
        return False
    name = str(settings.DATABASES["default"]["NAME"])
    return ":memory:" not in name and "mode=memory" not in name


def _reset_sqlite_file() -> None:
    path = Path(settings.DATABASES["default"]["NAME"])
    _close_db()
    for candidate in (path, Path(f"{path}-wal"), Path(f"{path}-shm"), Path(f"{path}-journal")):
        candidate.unlink(missing_ok=True)
    logger.warning("Fichier SQLite recréé après schéma incomplet : %s", path)


def ensure_database_ready() -> None:
    """
    Garantit migrate + seed si les tables publiques manquent.

    Cas constaté en prod : connexion SQLite OK (SELECT 1) mais
    public_content_newsarticle absent → /news/ en 503.
    """
    if check_database(require_public_content=True).ok:
        return

    logger.warning("Base incomplète — bootstrap migrate/seed")
    call_command("migrate", interactive=False, verbosity=0)

    if not check_database(require_public_content=True).ok:
        if not _is_file_sqlite():
            raise RuntimeError(
                "Schéma DB incomplet après migrate. "
                "Vérifiez DATABASE_URL / droits Postgres (ou SQLite fichier)."
            )
        # Drift classique Render : django_migrations OK, tables absentes
        _reset_sqlite_file()
        call_command("migrate", interactive=False, verbosity=0)

    call_command("seed_public_content", verbosity=0)
    call_command("seed_staff", verbosity=0)

    health = check_database(require_public_content=True)
    if not health.ok:
        raise RuntimeError(
            f"Bootstrap DB échoué ({health.error_type}): {health.error_message}"
        )
    logger.info("Bootstrap DB OK (engine=%s)", health.engine)
