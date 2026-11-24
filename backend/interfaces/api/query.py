"""Helpers de validation des paramètres de requête API."""

from __future__ import annotations

from application.use_cases import ValidationError

DEFAULT_LIST_LIMIT = 20
MAX_LIST_LIMIT = 50


def parse_limit(
    raw: str | None,
    *,
    default: int = DEFAULT_LIST_LIMIT,
    maximum: int = MAX_LIST_LIMIT,
) -> int:
    """Parse et borne le paramètre `limit` (400 si invalide)."""
    if raw is None or raw == "":
        return default
    try:
        value = int(raw)
    except (TypeError, ValueError) as exc:
        raise ValidationError("Le paramètre limit doit être un entier.", field="limit") from exc
    if value < 1:
        raise ValidationError("Le paramètre limit doit être >= 1.", field="limit")
    return min(value, maximum)
