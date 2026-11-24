from django.contrib import admin

from apps.public_content.models import (
    CivilStatusRequest,
    ConsularRegistrationRequest,
    ConsularService,
    ContactMessage,
    FaqItem,
    NewsArticle,
    VisaCategory,
)


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ("title_fr", "category", "is_published", "is_provisional", "published_at")
    list_filter = ("category", "is_published", "is_provisional")
    prepopulated_fields = {"slug": ("title_fr",)}
    search_fields = ("title_fr", "title_en", "title_ko")


@admin.register(FaqItem)
class FaqItemAdmin(admin.ModelAdmin):
    list_display = ("question_fr", "category", "is_published", "sort_order")
    list_filter = ("category", "is_published")


@admin.register(ConsularService)
class ConsularServiceAdmin(admin.ModelAdmin):
    list_display = ("title_fr", "is_published", "requires_account", "sort_order")
    prepopulated_fields = {"slug": ("title_fr",)}


@admin.register(VisaCategory)
class VisaCategoryAdmin(admin.ModelAdmin):
    list_display = ("title_fr", "is_published", "is_provisional", "sort_order")
    prepopulated_fields = {"slug": ("title_fr",)}


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "full_name", "category", "is_handled", "created_at")
    list_filter = ("category", "is_handled")
    readonly_fields = ("created_at", "updated_at", "ip_address")


@admin.register(ConsularRegistrationRequest)
class ConsularRegistrationRequestAdmin(admin.ModelAdmin):
    list_display = ("nom", "post_nom", "prenom", "email", "is_handled", "created_at")
    list_filter = ("is_handled", "sexe", "etat_civil")
    search_fields = ("nom", "post_nom", "prenom", "email", "numero_passeport")
    readonly_fields = ("created_at", "updated_at", "ip_address", "password_hash")


@admin.register(CivilStatusRequest)
class CivilStatusRequestAdmin(admin.ModelAdmin):
    list_display = ("document_type", "nom", "prenom", "email", "is_handled", "created_at")
    list_filter = ("document_type", "is_handled", "sexe")
    search_fields = ("nom", "post_nom", "prenom", "email", "numero_passeport")
    readonly_fields = ("created_at", "updated_at", "ip_address", "password_hash")
