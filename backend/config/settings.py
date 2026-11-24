"""
Configuration Django — Ambassade RDC en République de Corée.

Principes :
- Secrets via variables d'environnement (jamais en dur en production).
- Sécurité renforcée (headers, CORS strict, throttling API).
- Clean Architecture : les apps Django restent côté infrastructure/interfaces.
"""

from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Environnement
# ---------------------------------------------------------------------------

DJANGO_ENV = os.getenv("DJANGO_ENV", "development").lower()
IS_PRODUCTION = DJANGO_ENV in {"production", "prod"}

# ---------------------------------------------------------------------------
# Sécurité de base
# ---------------------------------------------------------------------------

_DEV_SECRET = "dev-only-insecure-key-remplacer-en-production-ambadrcor-2026"
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "")

if IS_PRODUCTION:
    if not SECRET_KEY or SECRET_KEY == _DEV_SECRET:
        raise ImproperlyConfigured(
            "DJANGO_SECRET_KEY doit être défini avec une valeur forte en production."
        )
    DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() in {"1", "true", "yes"}
    if DEBUG:
        raise ImproperlyConfigured("DJANGO_DEBUG ne peut pas être True en production.")
else:
    SECRET_KEY = SECRET_KEY or _DEV_SECRET
    DEBUG = os.getenv("DJANGO_DEBUG", "True").lower() in {"1", "true", "yes"}

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

# Render injecte automatiquement le hostname du service
_render_host = os.getenv("RENDER_EXTERNAL_HOSTNAME", "").strip()
if _render_host and _render_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_render_host)

if IS_PRODUCTION and (not ALLOWED_HOSTS or ALLOWED_HOSTS == ["localhost", "127.0.0.1"]):
    raise ImproperlyConfigured(
        "DJANGO_ALLOWED_HOSTS doit contenir les hôtes de production."
    )

# Documentation OpenAPI exposée uniquement en debug ou si explicitement autorisée
EXPOSE_API_DOCS = DEBUG or os.getenv("EXPOSE_API_DOCS", "False").lower() in {
    "1",
    "true",
    "yes",
}

# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "django_filters",
    "rest_framework",
    "rest_framework.authtoken",
    "drf_spectacular",
    "apps.public_content",
    "apps.accounts",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ---------------------------------------------------------------------------
# Base de données — SQLite en local ; PostgreSQL obligatoire en production
# ---------------------------------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL.startswith("postgres"):
    parsed = urlparse(DATABASE_URL)
    qs = parse_qs(parsed.query)
    sslmode = (qs.get("sslmode") or [None])[0]
    host = parsed.hostname or ""
    # SSL pour hôtes externes uniquement (ex. *.render.com) ; pas le host interne Render
    if not sslmode and IS_PRODUCTION and "." in host:
        sslmode = "require"
    db_config: dict = {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": unquote(parsed.path.lstrip("/")),
        "USER": unquote(parsed.username or ""),
        "PASSWORD": unquote(parsed.password or ""),
        "HOST": host,
        "PORT": str(parsed.port or 5432),
    }
    if sslmode:
        db_config["OPTIONS"] = {"sslmode": sslmode}
    DATABASES = {"default": db_config}
else:
    # Déploiement test Render : SQLite si DATABASE_URL absent
    # SQLITE_PATH optionnel (ex. disque persistant Render) — sinon BASE_DIR/db.sqlite3
    _sqlite_path = os.getenv("SQLITE_PATH", "").strip()
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": Path(_sqlite_path) if _sqlite_path else BASE_DIR / "db.sqlite3",
        }
    }
    if IS_PRODUCTION and DATABASE_URL:
        # DATABASE_URL non-postgres (typo / mauvaise valeur) → SQLite, mais on journalise
        import logging

        logging.getLogger(__name__).warning(
            "DATABASE_URL est défini mais n'est pas postgres — fallback SQLite. "
            "Sur Render, supprimez DATABASE_URL pour éviter les 503 /news/."
        )

# ---------------------------------------------------------------------------
# Auth / mots de passe
# ---------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------------------------------------------------------
# i18n
# ---------------------------------------------------------------------------

LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True

LANGUAGES = [
    ("fr", "Français"),
    ("en", "English"),
    ("ko", "한국어"),
]

# ---------------------------------------------------------------------------
# Fichiers statiques / media
# ---------------------------------------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
# Les fichiers private/visa/ ne doivent jamais être servis publiquement.
# Accès uniquement via endpoints authentifiés / back-office.
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# CORS / CSRF — origines explicites uniquement
# ---------------------------------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CSRF_TRUSTED_ORIGINS",
        ",".join(CORS_ALLOWED_ORIGINS),
    ).split(",")
    if origin.strip()
]

# ---------------------------------------------------------------------------
# Django REST Framework + OpenAPI
# ---------------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/hour",
        "user": "600/hour",
        "contact": "10/hour",
        "consular_registration": "5/hour",
        "civil_status": "5/hour",
        "auth": "20/hour",
        "visa_preapplication": "5/hour",
    },
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "EXCEPTION_HANDLER": "interfaces.api.exceptions.api_exception_handler",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "API Ambassade RDC — République de Corée",
    "DESCRIPTION": (
        "API officielle de la plateforme numérique de l'Ambassade de la "
        "République démocratique du Congo en République de Corée. "
        "Documentation OpenAPI 3 — portail public (phase actuelle)."
    ),
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "CONTACT": {"name": "Ambassade RDC — Support technique"},
    "LICENSE": {"name": "Usage institutionnel"},
}

# ---------------------------------------------------------------------------
# Sécurité HTTP (activée davantage hors DEBUG)
# ---------------------------------------------------------------------------

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ---------------------------------------------------------------------------
# E-mail (Django 6 MAILERS — pas de EMAIL_BACKEND legacy)
# ---------------------------------------------------------------------------

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    "Ambassade RDC Séoul <noreply@ambadrcor.local>",
)

MAILERS = {
    "default": {
        "BACKEND": os.getenv(
            "EMAIL_BACKEND",
            "django.core.mail.backends.console.EmailBackend",
        ),
    },
}

# ---------------------------------------------------------------------------
# Notifications (PHASE 8) — canaux configurables
# ---------------------------------------------------------------------------

PUBLIC_APP_URL = os.getenv("PUBLIC_APP_URL", "http://localhost:5173")
NOTIFICATION_CHANNELS = tuple(
    c.strip()
    for c in os.getenv("NOTIFICATION_CHANNELS", "in_app,email").split(",")
    if c.strip()
)
NOTIFICATIONS_EMAIL_ENABLED = os.getenv("NOTIFICATIONS_EMAIL_ENABLED", "true").lower() in {
    "1",
    "true",
    "yes",
}
NOTIFICATIONS_SMS_ENABLED = os.getenv("NOTIFICATIONS_SMS_ENABLED", "false").lower() in {
    "1",
    "true",
    "yes",
}
SMS_BACKEND = os.getenv("SMS_BACKEND", "console")
NOTIFICATIONS_LOG_DELIVERIES = os.getenv("NOTIFICATIONS_LOG_DELIVERIES", "true").lower() in {
    "1",
    "true",
    "yes",
}
APPOINTMENT_REMINDER_DAYS = int(os.getenv("APPOINTMENT_REMINDER_DAYS", "1"))
