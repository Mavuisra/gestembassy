from django.contrib import admin

from apps.accounts.models import (
    Appointment,
    AuditLog,
    CaseEvent,
    CitizenProfile,
    Incident,
    NotificationDelivery,
    PassportRequest,
    StaffProfile,
    UserNotification,
    VisaPreApplication,
    VisaSupportingDocument,
)


@admin.register(CitizenProfile)
class CitizenProfileAdmin(admin.ModelAdmin):
    list_display = ("nom", "post_nom", "prenom", "user", "telephone", "locale", "created_at")
    search_fields = ("nom", "post_nom", "prenom", "user__email", "telephone")
    list_filter = ("locale",)
    readonly_fields = ("created_at", "updated_at")


class VisaSupportingDocumentInline(admin.TabularInline):
    model = VisaSupportingDocument
    extra = 0
    readonly_fields = ("doc_type", "original_name", "content_type", "size_bytes", "uploaded_at", "file")
    can_delete = False


@admin.register(VisaPreApplication)
class VisaPreApplicationAdmin(admin.ModelAdmin):
    list_display = ("reference", "visa_type", "nom", "prenom", "status", "user", "created_at")
    list_filter = ("status", "visa_type")
    search_fields = ("reference", "nom", "prenom", "email", "passeport_numero")
    readonly_fields = ("reference", "created_at", "updated_at")
    inlines = [VisaSupportingDocumentInline]


@admin.register(VisaSupportingDocument)
class VisaSupportingDocumentAdmin(admin.ModelAdmin):
    list_display = ("application", "doc_type", "original_name", "size_bytes", "uploaded_at")
    list_filter = ("doc_type",)
    search_fields = ("application__reference", "original_name")
    readonly_fields = ("uploaded_at",)


@admin.register(PassportRequest)
class PassportRequestAdmin(admin.ModelAdmin):
    list_display = ("reference", "request_kind", "nom", "prenom", "status", "user", "created_at")
    list_filter = ("status", "request_kind")
    search_fields = ("reference", "nom", "prenom", "email")
    readonly_fields = ("reference", "created_at", "updated_at")


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("reference", "service_type", "preferred_date", "status", "user", "created_at")
    list_filter = ("status", "service_type")
    search_fields = ("reference", "related_case_reference")
    readonly_fields = ("reference", "created_at", "updated_at")


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "is_read", "created_at")
    list_filter = ("is_read",)
    search_fields = ("title", "body", "user__email")


@admin.register(NotificationDelivery)
class NotificationDeliveryAdmin(admin.ModelAdmin):
    list_display = ("channel", "recipient", "subject", "success", "created_at")
    list_filter = ("channel", "success")
    search_fields = ("recipient", "subject")
    readonly_fields = ("created_at",)


@admin.register(CaseEvent)
class CaseEventAdmin(admin.ModelAdmin):
    list_display = ("case_reference", "case_type", "event_type", "user", "created_at")
    list_filter = ("case_type", "event_type")
    search_fields = ("case_reference", "message")


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("display_name", "user", "role", "created_at")
    list_filter = ("role",)
    search_fields = ("display_name", "user__email", "user__username")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "entity_type", "entity_ref", "actor", "created_at")
    list_filter = ("action", "entity_type")
    search_fields = ("entity_ref", "action")
    readonly_fields = ("created_at",)


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ("reference", "category", "priority", "status", "full_name", "created_at")
    list_filter = ("category", "priority", "status")
    search_fields = ("reference", "full_name", "email")
    readonly_fields = ("reference", "created_at", "updated_at")
