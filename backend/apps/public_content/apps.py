from django.apps import AppConfig


class PublicContentConfig(AppConfig):
    """Contenus publics institutionnels (actualités, FAQ, services, pages)."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.public_content"
    verbose_name = "Contenus publics"
