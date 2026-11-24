"""Tests — permissions back-office (PHASE 7)."""

from __future__ import annotations

from interfaces.api.backoffice.permissions import (
    OPS_ROLES,
    ROLE_ADMIN,
    ROLE_ASSISTANCE,
    ROLE_COMMS,
    ROLE_CONSULAR,
    staff_role,
)


class FakeUser:
    def __init__(self, *, is_authenticated=True, is_staff=True, is_superuser=False, role=None):
        self.is_authenticated = is_authenticated
        self.is_staff = is_staff
        self.is_superuser = is_superuser
        self.is_active = True
        if role:
            self.staff_profile = type("P", (), {"role": role})()


def test_staff_role_defaults_for_superuser():
    assert staff_role(FakeUser(is_superuser=True)) == ROLE_ADMIN


def test_staff_role_from_profile():
    assert staff_role(FakeUser(role=ROLE_CONSULAR)) == ROLE_CONSULAR
    assert staff_role(FakeUser(role=ROLE_COMMS)) == ROLE_COMMS
    assert staff_role(FakeUser(role=ROLE_ASSISTANCE)) == ROLE_ASSISTANCE


def test_non_staff_has_no_role():
    assert staff_role(FakeUser(is_staff=False)) is None
    assert staff_role(FakeUser(is_authenticated=False)) is None


def test_ops_roles_include_admin_and_consular():
    assert ROLE_ADMIN in OPS_ROLES
    assert ROLE_CONSULAR in OPS_ROLES
    assert ROLE_COMMS not in OPS_ROLES
