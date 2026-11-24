"""Tests — changement de statut dossier (PHASE 7)."""

from __future__ import annotations

from interfaces.api.backoffice.services import ALLOWED_CASE_STATUSES


def test_allowed_statuses_cover_main_types():
    for case_type in ("visa", "passport", "civil", "consular"):
        assert "submitted" in ALLOWED_CASE_STATUSES[case_type]
        assert "accepted" in ALLOWED_CASE_STATUSES[case_type]
        assert "rejected" in ALLOWED_CASE_STATUSES[case_type]


def test_visa_allows_draft():
    assert "draft" in ALLOWED_CASE_STATUSES["visa"]
