"""Vues API back-office (PHASE 7)."""

from __future__ import annotations

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import FileResponse, Http404
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from apps.accounts.models import Appointment, Incident, StaffProfile, VisaSupportingDocument
from apps.public_content.models import FaqItem, NewsArticle
from apps.accounts.models import CitizenProfile
from interfaces.api.backoffice.permissions import (
    ALL_STAFF,
    ASSISTANCE_ROLES,
    CONTENT_ROLES,
    HasStaffRole,
    IsBackofficeUser,
    OPS_ROLES,
    staff_role,
)
from interfaces.api.backoffice import services


def ok(data, *, status_code: int = status.HTTP_200_OK, meta: dict | None = None) -> Response:
    payload = {"success": True, "data": data, "error": None}
    if meta is not None:
        payload["meta"] = meta
    return Response(payload, status=status_code)


def fail(message: str, *, code: str = "error", status_code: int = 400) -> Response:
    return Response(
        {"success": False, "data": None, "error": {"message": message, "code": code}},
        status=status_code,
    )


def _ip(request) -> str | None:
    return request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get(
        "REMOTE_ADDR"
    )


class StaffAuthThrottle(AnonRateThrottle):
    scope = "auth"
    rate = "20/hour"


class StaffLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [StaffAuthThrottle]
    authentication_classes: list = []

    @extend_schema(tags=["Back-office — Auth"], summary="Connexion agent")
    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))
        user = authenticate(username=email, password=password)
        if user is None:
            user = authenticate(username=request.data.get("email", ""), password=password)
        if user is None or not user.is_active or not user.is_staff:
            return fail("Identifiants invalides ou accès non autorisé.", code="unauthorized", status_code=401)
        profile = services.ensure_staff_profile(user)
        token, _ = Token.objects.get_or_create(user=user)
        services.record_audit(
            actor=user,
            action="staff_login",
            entity_type="user",
            entity_ref=str(user.id),
            ip=_ip(request),
        )
        return ok(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "email": user.email or user.username,
                    "display_name": profile.display_name or user.get_full_name() or user.username,
                    "role": profile.role,
                    "is_staff": True,
                },
            }
        )


class StaffMeView(APIView):
    permission_classes = [IsBackofficeUser]

    @extend_schema(tags=["Back-office — Auth"], summary="Profil agent courant")
    def get(self, request):
        profile = services.ensure_staff_profile(request.user)
        return ok(
            {
                "id": request.user.id,
                "email": request.user.email or request.user.username,
                "display_name": profile.display_name or request.user.get_full_name(),
                "role": profile.role,
                "is_staff": True,
            }
        )


class DashboardView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ALL_STAFF

    @extend_schema(tags=["Back-office — Dashboard"], summary="Indicateurs")
    def get(self, request):
        return ok(services.dashboard_stats())


class StatsView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = OPS_ROLES

    @extend_schema(tags=["Back-office — Stats"], summary="Séries statistiques")
    def get(self, request):
        days = int(request.query_params.get("days") or 14)
        return ok(services.stats_series(days=min(max(days, 7), 90)))


class RequestsListView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ASSISTANCE_ROLES

    @extend_schema(
        tags=["Back-office — Demandes"],
        summary="File unifiée des demandes",
        parameters=[
            OpenApiParameter("type", str, required=False),
            OpenApiParameter("status", str, required=False),
            OpenApiParameter("q", str, required=False),
        ],
    )
    def get(self, request):
        items = services.list_requests(
            case_type=request.query_params.get("type"),
            status=request.query_params.get("status"),
            q=request.query_params.get("q", ""),
        )
        return ok(items, meta={"count": len(items)})


class RequestDetailView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ASSISTANCE_ROLES

    @extend_schema(tags=["Back-office — Demandes"], summary="Détail d'une demande")
    def get(self, request, case_type: str, reference: str):
        item = services.get_request(case_type, reference)
        if item is None:
            return fail("Dossier introuvable.", code="not_found", status_code=404)
        return ok(item)


class RequestStatusView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = OPS_ROLES

    @extend_schema(tags=["Back-office — Demandes"], summary="Changer le statut")
    def patch(self, request, case_type: str, reference: str):
        new_status = str(request.data.get("status", "")).strip()
        note = str(request.data.get("note", "")).strip()
        try:
            updated = services.update_request_status(
                case_type=case_type,
                reference=reference,
                new_status=new_status,
                note=note,
                actor=request.user,
                ip=_ip(request),
            )
        except LookupError:
            return fail("Dossier introuvable.", code="not_found", status_code=404)
        except ValueError as exc:
            return fail(str(exc), code="validation_error")
        return ok(updated)


class RequestReplyView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = OPS_ROLES

    @extend_schema(tags=["Back-office — Demandes"], summary="Répondre par e-mail à l'usager")
    def post(self, request, case_type: str, reference: str):
        also = str(request.data.get("also_set_status", "")).strip() or None
        try:
            result = services.reply_to_request(
                case_type=case_type,
                reference=reference,
                subject=str(request.data.get("subject", "")),
                body=str(request.data.get("body", "")),
                actor=request.user,
                also_set_status=also,
                ip=_ip(request),
            )
        except LookupError:
            return fail("Dossier introuvable.", code="not_found", status_code=404)
        except ValueError as exc:
            return fail(str(exc), code="validation_error")
        except Exception as exc:  # noqa: BLE001 — surface mail errors
            return fail(f"Envoi e-mail impossible : {exc}", code="mail_error", status_code=502)
        return ok(result)


class DocumentDownloadView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ASSISTANCE_ROLES

    @extend_schema(tags=["Back-office — Documents"], summary="Télécharger une pièce")
    def get(self, request, document_id: int):
        try:
            doc = VisaSupportingDocument.objects.select_related("application").get(pk=document_id)
        except VisaSupportingDocument.DoesNotExist as exc:
            raise Http404 from exc
        services.record_audit(
            actor=request.user,
            action="document_download",
            entity_type="visa_document",
            entity_ref=str(doc.id),
            after={"application": doc.application.reference, "doc_type": doc.doc_type},
            ip=_ip(request),
        )
        return FileResponse(doc.file.open("rb"), as_attachment=True, filename=doc.original_name)


class AppointmentsStaffView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = OPS_ROLES

    @extend_schema(tags=["Back-office — RDV"], summary="Lister les rendez-vous")
    def get(self, request):
        qs = Appointment.objects.select_related("user").order_by("-created_at")[:200]
        return ok(
            [
                {
                    "reference": a.reference,
                    "status": a.status,
                    "service_type": a.service_type,
                    "preferred_date": a.preferred_date,
                    "preferred_slot": a.preferred_slot,
                    "notes": a.notes,
                    "user_id": a.user_id,
                    "email": a.user.email if a.user_id else None,
                    "applicant": a.user.get_full_name() or (a.user.email if a.user_id else None),
                    "created_at": a.created_at.isoformat() if a.created_at else None,
                }
                for a in qs
            ]
        )


class AppointmentStatusView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = OPS_ROLES

    @extend_schema(tags=["Back-office — RDV"], summary="Mettre à jour un rendez-vous")
    def patch(self, request, reference: str):
        try:
            appt = Appointment.objects.get(reference=reference)
        except Appointment.DoesNotExist:
            return fail("Rendez-vous introuvable.", status_code=404)
        new_status = str(request.data.get("status", "")).strip()
        if new_status not in {"requested", "confirmed", "cancelled", "completed"}:
            return fail("Statut invalide.")
        before = appt.status
        appt.status = new_status
        appt.save(update_fields=["status", "updated_at"])
        services.record_audit(
            actor=request.user,
            action="appointment_status",
            entity_type="appointment",
            entity_ref=reference,
            before={"status": before},
            after={"status": new_status},
            ip=_ip(request),
        )
        from infrastructure.notifications.service import notify_appointment

        notify_appointment(
            user_id=appt.user_id,
            email=appt.user.email if appt.user_id else None,
            reference=appt.reference,
            status=new_status,
            preferred_date=appt.preferred_date,
            preferred_slot=appt.preferred_slot,
        )
        return ok({"reference": reference, "status": new_status})


class IncidentsView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ASSISTANCE_ROLES

    @extend_schema(tags=["Back-office — Incidents"], summary="Lister les incidents")
    def get(self, request):
        qs = Incident.objects.all().order_by("-created_at")[:200]
        return ok(
            [
                {
                    "reference": i.reference,
                    "category": i.category,
                    "priority": i.priority,
                    "status": i.status,
                    "full_name": i.full_name,
                    "email": i.email,
                    "phone": i.phone,
                    "description": i.description,
                    "assigned_to": i.assigned_to_id,
                    "created_at": i.created_at.isoformat() if i.created_at else None,
                }
                for i in qs
            ]
        )

    @extend_schema(tags=["Back-office — Incidents"], summary="Créer un incident")
    def post(self, request):
        role = staff_role(request.user)
        if role not in ASSISTANCE_ROLES and not request.user.is_superuser:
            return fail("Permission insuffisante.", status_code=403)
        required = ("category", "full_name", "description")
        for field in required:
            if not str(request.data.get(field, "")).strip():
                return fail(f"Champ « {field} » requis.")
        obj = services.create_incident(
            category=request.data["category"],
            priority=request.data.get("priority", "medium"),
            full_name=request.data["full_name"],
            email=request.data.get("email", ""),
            phone=request.data.get("phone", ""),
            description=request.data["description"],
            locale=request.data.get("locale", "fr"),
            actor=request.user,
        )
        return ok(
            {"reference": obj.reference, "status": obj.status, "category": obj.category},
            status_code=201,
        )


class IncidentDetailView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ASSISTANCE_ROLES

    @extend_schema(tags=["Back-office — Incidents"], summary="Détail / mise à jour incident")
    def get(self, request, reference: str):
        try:
            i = Incident.objects.get(reference=reference)
        except Incident.DoesNotExist:
            return fail("Incident introuvable.", status_code=404)
        return ok(
            {
                "reference": i.reference,
                "category": i.category,
                "priority": i.priority,
                "status": i.status,
                "full_name": i.full_name,
                "email": i.email,
                "phone": i.phone,
                "description": i.description,
                "assigned_to": i.assigned_to_id,
                "created_at": i.created_at.isoformat() if i.created_at else None,
            }
        )

    def patch(self, request, reference: str):
        role = staff_role(request.user)
        if role not in ASSISTANCE_ROLES and not request.user.is_superuser:
            return fail("Permission insuffisante.", status_code=403)
        try:
            i = Incident.objects.get(reference=reference)
        except Incident.DoesNotExist:
            return fail("Incident introuvable.", status_code=404)
        before = {"status": i.status, "priority": i.priority}
        if "status" in request.data:
            i.status = request.data["status"]
        if "priority" in request.data:
            i.priority = request.data["priority"]
        if "assigned_to" in request.data:
            i.assigned_to_id = request.data.get("assigned_to") or None
        i.save()
        services.record_audit(
            actor=request.user,
            action="incident_update",
            entity_type="incident",
            entity_ref=reference,
            before=before,
            after={"status": i.status, "priority": i.priority},
            ip=_ip(request),
        )
        return ok({"reference": i.reference, "status": i.status, "priority": i.priority})


class CitizensListView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ASSISTANCE_ROLES

    @extend_schema(tags=["Back-office — Usagers"], summary="Lister les usagers")
    def get(self, request):
        qs = CitizenProfile.objects.select_related("user").order_by("-created_at")[:200]
        return ok(
            [
                {
                    "id": p.user_id,
                    "email": p.user.email,
                    "nom": p.nom,
                    "post_nom": p.post_nom,
                    "prenom": p.prenom,
                    "telephone": p.telephone,
                    "locale": p.locale,
                    "created_at": p.created_at.isoformat() if p.created_at else None,
                }
                for p in qs
            ]
        )


class NewsStaffView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = CONTENT_ROLES

    @extend_schema(tags=["Back-office — Contenu"], summary="Lister les actualités")
    def get(self, request):
        return ok(
            [
                {
                    "id": n.id,
                    "slug": n.slug,
                    "title_fr": n.title_fr,
                    "is_published": n.is_published,
                    "is_provisional": n.is_provisional,
                    "published_at": n.published_at.isoformat() if n.published_at else None,
                }
                for n in NewsArticle.objects.order_by("-published_at", "-id")[:100]
            ]
        )


class NewsPublishView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = CONTENT_ROLES

    @extend_schema(tags=["Back-office — Contenu"], summary="Publier / dépublier une actualité")
    def patch(self, request, news_id: int):
        try:
            n = NewsArticle.objects.get(pk=news_id)
        except NewsArticle.DoesNotExist:
            return fail("Actualité introuvable.", status_code=404)
        if "is_published" in request.data:
            n.is_published = bool(request.data["is_published"])
        if "is_provisional" in request.data:
            n.is_provisional = bool(request.data["is_provisional"])
        n.save()
        services.record_audit(
            actor=request.user,
            action="news_publish",
            entity_type="news",
            entity_ref=n.slug,
            after={"is_published": n.is_published, "is_provisional": n.is_provisional},
            ip=_ip(request),
        )
        return ok({"id": n.id, "slug": n.slug, "is_published": n.is_published})


class FaqStaffView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = CONTENT_ROLES

    @extend_schema(tags=["Back-office — Contenu"], summary="Lister la FAQ")
    def get(self, request):
        return ok(
            [
                {
                    "id": f.id,
                    "category": f.category,
                    "question_fr": f.question_fr,
                    "is_published": f.is_published,
                    "is_provisional": f.is_provisional,
                }
                for f in FaqItem.objects.order_by("category", "id")[:200]
            ]
        )


class FaqPublishView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = CONTENT_ROLES

    @extend_schema(tags=["Back-office — Contenu"], summary="Publier / dépublier une FAQ")
    def patch(self, request, faq_id: int):
        try:
            f = FaqItem.objects.get(pk=faq_id)
        except FaqItem.DoesNotExist:
            return fail("FAQ introuvable.", status_code=404)
        if "is_published" in request.data:
            f.is_published = bool(request.data["is_published"])
        if "is_provisional" in request.data:
            f.is_provisional = bool(request.data["is_provisional"])
        f.save()
        return ok({"id": f.id, "is_published": f.is_published})


class AuditListView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = ALL_STAFF

    @extend_schema(tags=["Back-office — Audit"], summary="Journal d'audit")
    def get(self, request):
        from apps.accounts.models import AuditLog

        role = staff_role(request.user)
        qs = AuditLog.objects.select_related("actor").order_by("-created_at")
        if role != "admin":
            qs = qs.filter(actor=request.user)
        qs = qs[:200]
        return ok(
            [
                {
                    "id": a.id,
                    "action": a.action,
                    "entity_type": a.entity_type,
                    "entity_ref": a.entity_ref,
                    "actor": a.actor.email if a.actor else None,
                    "before": a.before,
                    "after": a.after,
                    "created_at": a.created_at.isoformat() if a.created_at else None,
                }
                for a in qs
            ]
        )


class StaffTeamView(APIView):
    permission_classes = [IsBackofficeUser, HasStaffRole]
    allowed_roles = {"admin"}

    @extend_schema(tags=["Back-office — Équipe"], summary="Lister / mettre à jour les agents")
    def get(self, request):
        qs = StaffProfile.objects.select_related("user").order_by("role", "id")
        return ok(
            [
                {
                    "user_id": p.user_id,
                    "email": p.user.email or p.user.username,
                    "display_name": p.display_name,
                    "role": p.role,
                    "is_active": p.user.is_active,
                }
                for p in qs
            ]
        )

    def patch(self, request):
        user_id = request.data.get("user_id")
        role = request.data.get("role")
        if role not in dict(StaffProfile.Role.choices):
            return fail("Rôle invalide.")
        try:
            profile = StaffProfile.objects.get(user_id=user_id)
        except StaffProfile.DoesNotExist:
            return fail("Agent introuvable.", status_code=404)
        before = profile.role
        profile.role = role
        profile.save(update_fields=["role", "updated_at"])
        services.record_audit(
            actor=request.user,
            action="staff_role_change",
            entity_type="staff",
            entity_ref=str(user_id),
            before={"role": before},
            after={"role": role},
            ip=_ip(request),
        )
        return ok({"user_id": user_id, "role": role})
