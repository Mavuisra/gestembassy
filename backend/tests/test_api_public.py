"""Tests d'intégration API publique."""

from __future__ import annotations

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.public_content.models import ConsularService, NewsArticle


@pytest.mark.django_db
def test_health():
    client = APIClient()
    response = client.get("/api/v1/health/")
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["status"] == "ok"
    assert response.json()["data"]["database"]["status"] == "ok"


@pytest.mark.django_db
def test_health_liveness_without_deep_db_check():
    client = APIClient()
    response = client.get("/api/v1/health/?deep=0")
    assert response.status_code == 200
    assert response.json()["data"]["database"]["status"] == "ok"


@pytest.mark.django_db
def test_news_database_error_returns_503(monkeypatch):
    from django.db.utils import OperationalError

    from infrastructure import repositories as repos

    def _boom(self, *, limit: int = 20):
        raise OperationalError("no such table: public_content_newsarticle")

    monkeypatch.setattr(repos.DjangoNewsRepository, "list_published", _boom)
    client = APIClient()
    response = client.get("/api/v1/news/?limit=3&locale=fr")
    assert response.status_code == 503
    body = response.json()
    assert body["success"] is False
    assert body["error"]["code"] == "database_unavailable"


@pytest.mark.django_db
def test_news_list_returns_published_only():
    NewsArticle.objects.create(
        slug="pub",
        title_fr="Publiée",
        body_fr="Contenu",
        is_published=True,
        published_at=timezone.now(),
    )
    NewsArticle.objects.create(
        slug="draft",
        title_fr="Brouillon",
        body_fr="Contenu",
        is_published=False,
    )
    client = APIClient()
    response = client.get("/api/v1/news/")
    assert response.status_code == 200
    slugs = [item["slug"] for item in response.json()["data"]]
    assert "pub" in slugs
    assert "draft" not in slugs


@pytest.mark.django_db
def test_news_invalid_limit_returns_400():
    client = APIClient()
    response = client.get("/api/v1/news/?limit=abc")
    assert response.status_code == 400
    body = response.json()
    assert body["success"] is False
    assert body["error"]["field"] == "limit"


@pytest.mark.django_db
def test_news_detail_404():
    client = APIClient()
    response = client.get("/api/v1/news/introuvable/")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "not_found"


@pytest.mark.django_db
def test_services_list_capped():
    for i in range(3):
        ConsularService.objects.create(
            slug=f"svc-{i}",
            title_fr=f"Service {i}",
            summary_fr="Résumé",
            is_published=True,
        )
    client = APIClient()
    response = client.get("/api/v1/services/?limit=2")
    assert response.status_code == 200
    body = response.json()
    assert len(body["data"]) == 2
    assert body["meta"]["limit"] == 2


@pytest.mark.django_db
def test_contact_create():
    client = APIClient()
    response = client.post(
        "/api/v1/contact/",
        {
            "category": "visa",
            "full_name": "Alice Kim",
            "email": "alice@example.com",
            "subject": "Question visa",
            "message": "Bonjour, je souhaite des informations sur le visa touristique pour la RDC.",
            "locale": "fr",
        },
        format="json",
    )
    assert response.status_code == 201
    assert response.json()["success"] is True
    assert "id" in response.json()["data"]
