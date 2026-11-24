"""Contrôles de disponibilité base de données (ops / healthcheck)."""

from __future__ import annotations

from dataclasses import dataclass

from django.db import connection
from django.db.utils import DatabaseError, OperationalError


@dataclass(frozen=True)
class DatabaseHealth:
    ok: bool
    engine: str
    error_type: str | None = None
    error_message: str | None = None

    def as_dict(self, *, expose_details: bool = False) -> dict:
        payload: dict = {
            "status": "ok" if self.ok else "error",
            "engine": self.engine,
        }
        if not self.ok:
            # error_type toujours utile en ops (pas de secret)
            payload["error_type"] = self.error_type
            if expose_details:
                payload["error_message"] = self.error_message
        return payload


def check_database(*, require_public_content: bool = True) -> DatabaseHealth:
    """
    Vérifie la connexion et, optionnellement, la présence des tables contenu public.

    Reproduit le symptôme prod : /health/ OK alors que /news/ tombe en 500
    (OperationalError: no such table / DB injoignable).
    """
    engine = connection.settings_dict.get("ENGINE", "").rpartition(".")[-1] or "unknown"
    try:
        connection.ensure_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        if require_public_content:
            # Import local pour éviter les cycles au boot settings
            from apps.public_content.models import FaqItem, NewsArticle

            NewsArticle.objects.exists()
            FaqItem.objects.exists()
        return DatabaseHealth(ok=True, engine=engine)
    except (OperationalError, DatabaseError) as exc:
        return DatabaseHealth(
            ok=False,
            engine=engine,
            error_type=type(exc).__name__,
            error_message=str(exc),
        )
    except Exception as exc:  # noqa: BLE001 — health ne doit jamais planter
        return DatabaseHealth(
            ok=False,
            engine=engine,
            error_type=type(exc).__name__,
            error_message=str(exc),
        )
