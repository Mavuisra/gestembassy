"""Utilitaires partagés pour les dossiers espace usager."""

from __future__ import annotations

import secrets
from datetime import datetime, timezone


def generate_case_reference(prefix: str) -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"{prefix}-{stamp}-{secrets.token_hex(3).upper()}"
