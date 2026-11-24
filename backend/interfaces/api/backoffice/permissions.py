"""Permissions back-office — staff + rôles."""

from __future__ import annotations

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission

ROLE_ADMIN = "admin"
ROLE_CONSULAR = "consular"
ROLE_COMMS = "comms"
ROLE_ASSISTANCE = "assistance"

OPS_ROLES = {ROLE_ADMIN, ROLE_CONSULAR}
CONTENT_ROLES = {ROLE_ADMIN, ROLE_COMMS, ROLE_CONSULAR}
ASSISTANCE_ROLES = {ROLE_ADMIN, ROLE_ASSISTANCE, ROLE_CONSULAR}
ALL_STAFF = {ROLE_ADMIN, ROLE_CONSULAR, ROLE_COMMS, ROLE_ASSISTANCE}


def staff_role(user) -> str | None:
    if not user or not user.is_authenticated or not getattr(user, "is_staff", False):
        return None
    # Superuser Django = administrateur back-office, toujours.
    if getattr(user, "is_superuser", False):
        return ROLE_ADMIN
    try:
        profile = user.staff_profile
    except ObjectDoesNotExist:
        return ROLE_CONSULAR
    except AttributeError:
        return ROLE_CONSULAR
    return profile.role or ROLE_CONSULAR


class IsBackofficeUser(BasePermission):
    message = "Accès réservé aux agents de l'ambassade (compte staff)."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
            and request.user.is_active
        )


class HasStaffRole(BasePermission):
    """À combiner avec allowed_roles sur la vue."""

    message = "Votre rôle agent ne permet pas cette action."

    def has_permission(self, request, view) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(user, "is_superuser", False):
            return True
        allowed = getattr(view, "allowed_roles", ALL_STAFF)
        role = staff_role(user)
        return role is not None and role in allowed
