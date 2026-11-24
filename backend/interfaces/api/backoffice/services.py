"""Services métier back-office — file dossiers, audit, stats."""

from __future__ import annotations

from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone

from apps.accounts.case_utils import generate_case_reference
from apps.accounts.models import (
    Appointment,
    AuditLog,
    CaseEvent,
    CitizenProfile,
    Incident,
    PassportRequest,
    StaffProfile,
    VisaPreApplication,
    VisaSupportingDocument,
)
from apps.public_content.models import (
    CivilStatusRequest,
    ConsularRegistrationRequest,
    FaqItem,
    NewsArticle,
)

ALLOWED_CASE_STATUSES = {
    "visa": {"draft", "submitted", "under_review", "needs_info", "accepted", "rejected"},
    "passport": {"submitted", "under_review", "needs_info", "accepted", "rejected"},
    "civil": {"submitted", "under_review", "needs_info", "accepted", "rejected"},
    "consular": {"submitted", "under_review", "needs_info", "accepted", "rejected"},
}


def record_audit(*, actor, action: str, entity_type: str, entity_ref: str, before=None, after=None, ip=None):
    return AuditLog.objects.create(
        actor=actor,
        action=action,
        entity_type=entity_type,
        entity_ref=entity_ref,
        before=before or {},
        after=after or {},
        ip_address=ip,
    )


def _case_row(case_type: str, reference: str, status: str, title: str, created_at, extra=None) -> dict:
    row = {
        "case_type": case_type,
        "reference": reference,
        "status": status,
        "title": title,
        "created_at": created_at.isoformat() if created_at else None,
    }
    if extra:
        row.update(extra)
    return row


def list_requests(*, case_type: str | None = None, status: str | None = None, q: str = "") -> list[dict]:
    items: list[dict] = []
    q = (q or "").strip().lower()

    if case_type in (None, "", "visa"):
        for o in VisaPreApplication.objects.all().order_by("-created_at")[:200]:
            items.append(
                _case_row(
                    "visa",
                    o.reference,
                    o.status,
                    o.visa_type,
                    o.created_at,
                    {"applicant": f"{o.nom} {o.prenom}", "email": o.email},
                )
            )
    if case_type in (None, "", "passport"):
        for o in PassportRequest.objects.all().order_by("-created_at")[:200]:
            items.append(
                _case_row(
                    "passport",
                    o.reference,
                    o.status,
                    o.request_kind,
                    o.created_at,
                    {"applicant": f"{o.nom} {o.prenom}", "email": o.email},
                )
            )
    if case_type in (None, "", "civil"):
        for o in CivilStatusRequest.objects.all().order_by("-created_at")[:200]:
            items.append(
                _case_row(
                    "civil",
                    o.reference or f"CIV-{o.id}",
                    o.status,
                    o.document_type,
                    o.created_at,
                    {"applicant": f"{o.nom} {o.prenom}", "email": o.email},
                )
            )
    if case_type in (None, "", "consular"):
        for o in ConsularRegistrationRequest.objects.all().order_by("-created_at")[:200]:
            items.append(
                _case_row(
                    "consular",
                    o.reference or f"CONS-{o.id}",
                    o.status,
                    "enregistrement",
                    o.created_at,
                    {"applicant": f"{o.nom} {o.prenom}", "email": o.email},
                )
            )

    if status:
        items = [i for i in items if i["status"] == status]
    if q:
        items = [
            i
            for i in items
            if q in i["reference"].lower()
            or q in (i.get("applicant") or "").lower()
            or q in (i.get("email") or "").lower()
            or q in (i.get("title") or "").lower()
        ]
    items.sort(key=lambda x: x.get("created_at") or "", reverse=True)
    return items


def _timeline(case_type: str, reference: str, user_id: int | None) -> list[dict]:
    events: list[dict] = []
    qs = CaseEvent.objects.filter(case_type=case_type, case_reference=reference)
    if user_id:
        qs = qs.filter(user_id=user_id)
    for e in qs.order_by("-created_at")[:50]:
        events.append(
            {
                "id": e.id,
                "event_type": e.event_type,
                "message": e.message,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
        )
    for a in AuditLog.objects.filter(entity_type=case_type, entity_ref=reference).order_by(
        "-created_at"
    )[:30]:
        events.append(
            {
                "id": f"audit-{a.id}",
                "event_type": a.action,
                "message": str((a.after or {}).get("note") or (a.after or {}).get("subject") or a.action),
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "actor": a.actor.email if a.actor_id else None,
            }
        )
    events.sort(key=lambda x: x.get("created_at") or "", reverse=True)
    return events[:40]


def get_request(case_type: str, reference: str) -> dict | None:
    if case_type == "visa":
        try:
            o = VisaPreApplication.objects.prefetch_related("documents").get(reference=reference)
        except VisaPreApplication.DoesNotExist:
            return None
        return {
            "case_type": "visa",
            "reference": o.reference,
            "status": o.status,
            "visa_type": o.visa_type,
            "title": o.visa_type,
            "nom": o.nom,
            "post_nom": o.post_nom,
            "prenom": o.prenom,
            "email": o.email,
            "telephone": o.telephone,
            "passeport_numero": o.passeport_numero,
            "passeport_expire_le": o.passeport_expire_le,
            "nationalite": o.nationalite,
            "date_naissance": o.date_naissance,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "updated_at": o.updated_at.isoformat() if o.updated_at else None,
            "user_id": o.user_id,
            "documents": [
                {
                    "id": d.id,
                    "doc_type": d.doc_type,
                    "original_name": d.original_name,
                    "size_bytes": d.size_bytes,
                }
                for d in o.documents.all()
            ],
            "timeline": _timeline("visa", o.reference, o.user_id),
        }
    if case_type == "passport":
        try:
            o = PassportRequest.objects.get(reference=reference)
        except PassportRequest.DoesNotExist:
            return None
        return {
            "case_type": "passport",
            "reference": o.reference,
            "status": o.status,
            "request_kind": o.request_kind,
            "title": o.request_kind,
            "nom": o.nom,
            "post_nom": o.post_nom,
            "prenom": o.prenom,
            "email": o.email,
            "telephone": o.telephone,
            "motif": o.motif,
            "date_naissance": o.date_naissance,
            "lieu_naissance": o.lieu_naissance,
            "numero_passeport_actuel": o.numero_passeport_actuel,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "updated_at": o.updated_at.isoformat() if o.updated_at else None,
            "user_id": o.user_id,
            "timeline": _timeline("passport", o.reference, o.user_id),
        }
    if case_type == "civil":
        try:
            o = CivilStatusRequest.objects.get(reference=reference)
        except CivilStatusRequest.DoesNotExist:
            return None
        return {
            "case_type": "civil",
            "reference": o.reference,
            "status": o.status,
            "document_type": o.document_type,
            "title": o.document_type,
            "nom": o.nom,
            "prenom": o.prenom,
            "email": o.email,
            "motif": o.motif,
            "is_handled": o.is_handled,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "user_id": o.user_id,
            "timeline": _timeline("civil", o.reference, o.user_id),
        }
    if case_type == "consular":
        try:
            o = ConsularRegistrationRequest.objects.get(reference=reference)
        except ConsularRegistrationRequest.DoesNotExist:
            return None
        return {
            "case_type": "consular",
            "reference": o.reference,
            "status": o.status,
            "title": "enregistrement",
            "nom": o.nom,
            "prenom": o.prenom,
            "email": o.email,
            "telephone": o.telephone,
            "is_handled": o.is_handled,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "user_id": o.user_id,
            "timeline": _timeline("consular", o.reference, o.user_id),
        }
    return None


def update_request_status(
    *,
    case_type: str,
    reference: str,
    new_status: str,
    note: str,
    actor,
    ip=None,
) -> dict:
    allowed = ALLOWED_CASE_STATUSES.get(case_type)
    if not allowed or new_status not in allowed:
        raise ValueError("Statut invalide pour ce type de dossier.")

    detail = get_request(case_type, reference)
    if detail is None:
        raise LookupError("Dossier introuvable.")
    old_status = detail["status"]

    user_id = detail.get("user_id")
    if case_type == "visa":
        VisaPreApplication.objects.filter(reference=reference).update(status=new_status)
    elif case_type == "passport":
        PassportRequest.objects.filter(reference=reference).update(status=new_status)
    elif case_type == "civil":
        CivilStatusRequest.objects.filter(reference=reference).update(
            status=new_status, is_handled=new_status in {"accepted", "rejected"}
        )
    elif case_type == "consular":
        ConsularRegistrationRequest.objects.filter(reference=reference).update(
            status=new_status, is_handled=new_status in {"accepted", "rejected"}
        )
    else:
        raise ValueError("Type de dossier inconnu.")

    record_audit(
        actor=actor,
        action="status_change",
        entity_type=case_type,
        entity_ref=reference,
        before={"status": old_status},
        after={"status": new_status, "note": note},
        ip=ip,
    )
    if user_id:
        CaseEvent.objects.create(
            user_id=user_id,
            case_type=case_type,
            case_reference=reference,
            event_type="status_change",
            message=note or f"Statut : {old_status} → {new_status}",
        )
        from infrastructure.notifications.service import notify_status_change

        notify_status_change(
            user_id=user_id,
            email=detail.get("email"),
            case_type=case_type,
            reference=reference,
            new_status=new_status,
            note=note,
        )
    return get_request(case_type, reference) or {}


def _count_by_day(qs, since):
    rows = (
        qs.filter(created_at__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )
    return {row["day"].isoformat(): row["count"] for row in rows if row["day"]}


def dashboard_stats() -> dict:
    today = timezone.localdate()
    received_today = (
        VisaPreApplication.objects.filter(created_at__date=today).count()
        + PassportRequest.objects.filter(created_at__date=today).count()
        + CivilStatusRequest.objects.filter(created_at__date=today).count()
        + ConsularRegistrationRequest.objects.filter(created_at__date=today).count()
    )
    recent = list_requests()[:8]
    series = stats_series(days=14)
    by_type = {
        "visa": VisaPreApplication.objects.count(),
        "passport": PassportRequest.objects.count(),
        "civil": CivilStatusRequest.objects.count(),
        "consular": ConsularRegistrationRequest.objects.count(),
    }
    total_requests = sum(by_type.values())
    pending = (
        VisaPreApplication.objects.exclude(status__in=["accepted", "rejected", "draft"]).count()
        + PassportRequest.objects.exclude(status__in=["accepted", "rejected"]).count()
        + CivilStatusRequest.objects.exclude(status__in=["accepted", "rejected"]).count()
        + ConsularRegistrationRequest.objects.exclude(status__in=["accepted", "rejected"]).count()
    )
    treated = (
        VisaPreApplication.objects.filter(status__in=["accepted", "rejected"]).count()
        + PassportRequest.objects.filter(status__in=["accepted", "rejected"]).count()
        + CivilStatusRequest.objects.filter(status__in=["accepted", "rejected"]).count()
        + ConsularRegistrationRequest.objects.filter(status__in=["accepted", "rejected"]).count()
    )
    appointments_total = Appointment.objects.count()
    audit_recent = list(
        AuditLog.objects.select_related("actor").order_by("-created_at")[:8].values(
            "id", "action", "entity_type", "entity_ref", "created_at"
        )
    )
    for row in audit_recent:
        if row.get("created_at"):
            row["created_at"] = row["created_at"].isoformat()
    return {
        "visa_total": by_type["visa"],
        "visa_pending": VisaPreApplication.objects.exclude(
            status__in=["accepted", "rejected", "draft"]
        ).count(),
        "passport_total": by_type["passport"],
        "passport_pending": PassportRequest.objects.exclude(
            status__in=["accepted", "rejected"]
        ).count(),
        "civil_total": by_type["civil"],
        "civil_pending": CivilStatusRequest.objects.exclude(
            status__in=["accepted", "rejected"]
        ).count(),
        "consular_total": by_type["consular"],
        "consular_pending": ConsularRegistrationRequest.objects.exclude(
            status__in=["accepted", "rejected"]
        ).count(),
        "appointments_upcoming": Appointment.objects.filter(
            status__in=["requested", "confirmed"]
        ).count(),
        "appointments_total": appointments_total,
        "incidents_open": Incident.objects.exclude(status="closed").count(),
        "citizens": CitizenProfile.objects.count(),
        "received_today": received_today,
        "total_requests": total_requests,
        "pending_total": pending,
        "treated_total": treated,
        "by_type": by_type,
        "recent_requests": recent,
        "recent_activity": audit_recent,
        "series": series,
    }


def stats_series(days: int = 14) -> dict:
    since = timezone.now() - timedelta(days=days)
    visa_map = _count_by_day(VisaPreApplication.objects.all(), since)
    passport_map = _count_by_day(PassportRequest.objects.all(), since)
    civil_map = _count_by_day(CivilStatusRequest.objects.all(), since)
    consular_map = _count_by_day(ConsularRegistrationRequest.objects.all(), since)

    day_list = []
    for i in range(days - 1, -1, -1):
        d = (timezone.localdate() - timedelta(days=i)).isoformat()
        day_list.append(
            {
                "day": d,
                "visa": visa_map.get(d, 0),
                "passport": passport_map.get(d, 0),
                "civil": civil_map.get(d, 0),
                "consular": consular_map.get(d, 0),
                "count": (
                    visa_map.get(d, 0)
                    + passport_map.get(d, 0)
                    + civil_map.get(d, 0)
                    + consular_map.get(d, 0)
                ),
            }
        )

    return {
        "days": days,
        "by_day": day_list,
        "visa_by_day": [{"day": r["day"], "count": r["visa"]} for r in day_list],
        "visa_by_status": list(
            VisaPreApplication.objects.values("status").annotate(count=Count("id")).order_by("status")
        ),
        "passport_by_status": list(
            PassportRequest.objects.values("status").annotate(count=Count("id")).order_by("status")
        ),
        "civil_by_status": list(
            CivilStatusRequest.objects.values("status").annotate(count=Count("id")).order_by("status")
        ),
        "consular_by_status": list(
            ConsularRegistrationRequest.objects.values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        ),
        "appointments_by_status": list(
            Appointment.objects.values("status").annotate(count=Count("id")).order_by("status")
        ),
        "incidents_by_priority": list(
            Incident.objects.values("priority").annotate(count=Count("id")).order_by("priority")
        ),
    }


def reply_to_request(
    *,
    case_type: str,
    reference: str,
    subject: str,
    body: str,
    actor,
    also_set_status: str | None = None,
    ip=None,
) -> dict:
    detail = get_request(case_type, reference)
    if detail is None:
        raise LookupError("Dossier introuvable.")
    email = (detail.get("email") or "").strip()
    if not email:
        raise ValueError("Aucun e-mail associé à ce dossier.")
    subject = (subject or "").strip()
    body = (body or "").strip()
    if len(subject) < 3:
        raise ValueError("Objet trop court.")
    if len(body) < 5:
        raise ValueError("Message trop court.")

    full_subject = f"[Ambassade RDC] {subject} — {reference}"
    footer = (
        f"\n\n---\nRéférence dossier : {reference}\n"
        "Ambassade de la République Démocratique du Congo — Séoul\n"
        "Ceci est un message officiel relatif à votre demande."
    )
    send_mail(
        subject=full_subject,
        message=body + footer,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

    user_id = detail.get("user_id")
    if user_id:
        CaseEvent.objects.create(
            user_id=user_id,
            case_type=case_type,
            case_reference=reference,
            event_type="staff_email",
            message=f"E-mail envoyé : {subject}",
        )
        from infrastructure.notifications.service import notify_user

        notify_user(
            user_id=user_id,
            email=None,
            title="Message de l'ambassade",
            body=subject[:200],
            link="/compte/dossiers",
            channels=("in_app",),
        )

    record_audit(
        actor=actor,
        action="staff_email",
        entity_type=case_type,
        entity_ref=reference,
        after={"subject": subject, "to": email},
        ip=ip,
    )

    if also_set_status:
        detail = update_request_status(
            case_type=case_type,
            reference=reference,
            new_status=also_set_status,
            note=f"Suite e-mail : {subject}",
            actor=actor,
            ip=ip,
        )
    else:
        detail = get_request(case_type, reference) or detail

    return {"sent": True, "to": email, "subject": full_subject, "request": detail}


def ensure_staff_profile(user: User) -> StaffProfile:
    defaults = {
        "role": StaffProfile.Role.ADMIN if user.is_superuser else StaffProfile.Role.CONSULAR,
        "display_name": user.get_full_name() or user.email or user.username,
    }
    profile, created = StaffProfile.objects.get_or_create(user=user, defaults=defaults)
    # Toujours aligner le superuser sur le rôle admin.
    if user.is_superuser and profile.role != StaffProfile.Role.ADMIN:
        profile.role = StaffProfile.Role.ADMIN
        if not profile.display_name:
            profile.display_name = defaults["display_name"]
        profile.save(update_fields=["role", "display_name", "updated_at"])
    elif created is False and not profile.display_name and defaults["display_name"]:
        profile.display_name = defaults["display_name"]
        profile.save(update_fields=["display_name", "updated_at"])
    return profile


def create_incident(*, category, priority, full_name, email, phone, description, locale, actor=None, linked_user_id=None):
    reference = generate_case_reference("INC")
    obj = Incident.objects.create(
        reference=reference,
        category=category,
        priority=priority,
        full_name=full_name.strip(),
        email=(email or "").strip().lower(),
        phone=(phone or "").strip(),
        description=description.strip(),
        locale=locale,
        linked_user_id=linked_user_id,
        assigned_to=actor if actor and actor.is_staff else None,
    )
    if actor:
        record_audit(
            actor=actor,
            action="incident_create",
            entity_type="incident",
            entity_ref=reference,
            after={"category": category, "priority": priority},
        )
    return obj
