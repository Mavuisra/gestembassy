"""
WSGI config — bootstrap DB au chargement worker (filet de sécurité Render).
"""

from __future__ import annotations

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()

# Après init Django : répare SQLite sans tables si le startCommand Render
# n'a pas (re)joué migrate/seed (service créé hors sync blueprint).
from infrastructure.bootstrap_db import ensure_database_ready  # noqa: E402

ensure_database_ready()
