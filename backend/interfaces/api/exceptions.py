"""Gestion centralisée des erreurs API."""

from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

from application.use_cases import ValidationError


def api_exception_handler(exc, context):
    """Enveloppe standard : success / data / error."""
    if isinstance(exc, ValidationError):
        return Response(
            {
                "success": False,
                "data": None,
                "error": {
                    "message": exc.message,
                    "field": exc.field,
                    "code": "validation_error",
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    response = exception_handler(exc, context)
    if response is not None:
        error_payload = {
            "message": _flatten_errors(response.data),
            "code": "api_error",
        }
        # Détails techniques uniquement en développement
        if settings.DEBUG:
            error_payload["details"] = response.data
        response.data = {
            "success": False,
            "data": None,
            "error": error_payload,
        }
        return response

    # Erreurs non gérées (ex. migration manquante) → enveloppe JSON, pas HTML.
    return Response(
        {
            "success": False,
            "data": None,
            "error": {
                "message": (
                    "Erreur serveur temporaire. Réessayez ; "
                    "si le problème persiste, contactez l'administrateur."
                ),
                "code": "server_error",
                **({"details": str(exc)} if settings.DEBUG else {}),
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


def _flatten_errors(data) -> str:
    if isinstance(data, dict):
        parts = []
        for key, value in data.items():
            if isinstance(value, (list, tuple)):
                parts.append(f"{key}: {', '.join(str(v) for v in value)}")
            else:
                parts.append(f"{key}: {value}")
        return " | ".join(parts) if parts else "Erreur API"
    if isinstance(data, list):
        return ", ".join(str(item) for item in data)
    return str(data)
