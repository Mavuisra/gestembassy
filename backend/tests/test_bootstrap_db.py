"""Bootstrap SQLite fichier quand les tables publiques manquent."""

from __future__ import annotations

import pytest
from django.core.management import call_command
from django.db import connections

from apps.public_content.models import NewsArticle
from infrastructure.bootstrap_db import ensure_database_ready


@pytest.fixture
def file_sqlite(tmp_path, settings):
    db_path = tmp_path / "bootstrap.sqlite3"
    settings.DATABASES["default"] = {
        **settings.DATABASES["default"],
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": str(db_path),
        "ATOMIC_REQUESTS": False,
    }
    connections.close_all()
    call_command("migrate", interactive=False, verbosity=0)
    call_command("seed_public_content", verbosity=0)
    yield db_path
    connections.close_all()


@pytest.mark.django_db(transaction=True)
def test_ensure_database_ready_recreates_missing_news_table(file_sqlite):
    connections.close_all()
    # Simule drift prod : fichier SQLite présent mais table news absente
    import sqlite3

    conn = sqlite3.connect(str(file_sqlite))
    conn.execute("DROP TABLE IF EXISTS public_content_newsarticle")
    conn.commit()
    conn.close()

    connections.close_all()
    ensure_database_ready()

    assert NewsArticle.objects.filter(is_published=True).exists()
    assert NewsArticle.objects.filter(is_published=True).count() >= 1
