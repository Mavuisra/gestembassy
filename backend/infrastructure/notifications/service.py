"""Orchestrateur notifications — in-app + e-mail + SMS optionnel."""

from __future__ import annotations

import logging
from dataclasses import dataclass

from django.conf import settings
from django.contrib.auth.models import User

from infrastructure.notifications.channels import get_email_channel, get_sms_channel

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class NotifyResult:
    in_app_id: int | None
    email: dict | None
    sms: dict | None


class NotificationService:
    def notify(
        self,
        *,
        user_id: int | None,
        email: str | None,
        phone: str | None = None,
        title: str,
        body: str,
        link: str = "",
        channels: tuple[str, ...] | None = None,
        email_subject: str | None = None,
    ) -> NotifyResult:
        enabled = tuple(getattr(settings, "NOTIFICATION_CHANNELS", ("in_app", "email")))
        wanted = channels or enabled
        in_app_id = None
        email_result = None
        sms_result = None

        if "in_app" in wanted and user_id:
            from apps.accounts.models import UserNotification

            n = UserNotification.objects.create(
                user_id=user_id,
                title=title[:200],
                body=body[:500],
                link=(link or "")[:255],
            )
            in_app_id = n.id

        if "email" in wanted and getattr(settings, "NOTIFICATIONS_EMAIL_ENABLED", True):
            to = (email or "").strip()
            if not to and user_id:
                try:
                    to = User.objects.get(pk=user_id).email
                except User.DoesNotExist:
                    to = ""
            if to:
                subject = email_subject or f"[Ambassade RDC] {title}"
                footer = (
                    "\n\n---\nAmbassade de la République Démocratique du Congo — Séoul\n"
                    f"{getattr(settings, 'PUBLIC_APP_URL', 'http://localhost:5173')}{link or ''}"
                )
                try:
                    email_result = get_email_channel().send(
                        to=to, subject=subject, body=body + footer
                    )
                except Exception as exc:  # noqa: BLE001
                    logger.exception("Échec e-mail notification")
                    email_result = {"ok": False, "channel": "email", "error": str(exc)}

        if "sms" in wanted and getattr(settings, "NOTIFICATIONS_SMS_ENABLED", False):
            to_phone = (phone or "").strip()
            if to_phone:
                try:
                    sms_result = get_sms_channel().send(
                        to=to_phone, subject=title, body=body[:160]
                    )
                except Exception as exc:  # noqa: BLE001
                    logger.exception("Échec SMS notification")
                    sms_result = {"ok": False, "channel": "sms", "error": str(exc)}

        if getattr(settings, "NOTIFICATIONS_LOG_DELIVERIES", True):
            from apps.accounts.models import NotificationDelivery

            for channel, result in (("email", email_result), ("sms", sms_result)):
                if result is None:
                    continue
                NotificationDelivery.objects.create(
                    user_id=user_id,
                    channel=channel,
                    recipient=result.get("to") or "",
                    subject=title[:200],
                    body=body[:500],
                    success=bool(result.get("ok")),
                    detail=result,
                )

        return NotifyResult(in_app_id=in_app_id, email=email_result, sms=sms_result)


_service = NotificationService()


def notify_user(**kwargs) -> NotifyResult:
    return _service.notify(**kwargs)


def notify_status_change(
    *,
    user_id: int | None,
    email: str | None,
    case_type: str,
    reference: str,
    new_status: str,
    note: str = "",
) -> NotifyResult:
    titles = {
        "needs_info": "Complément de documents demandé",
        "under_review": "Dossier en cours d'examen",
        "accepted": "Dossier accepté (pré-filtre)",
        "rejected": "Dossier refusé (pré-filtre)",
        "submitted": "Dossier soumis",
    }
    title = titles.get(new_status, f"Mise à jour de dossier ({new_status})")
    body = f"Votre dossier {reference} ({case_type}) est passé au statut « {new_status} »."
    if note:
        body = f"{body}\n\nMessage de l'ambassade : {note}"
    if new_status == "needs_info":
        body += "\n\nDes pièces ou informations complémentaires sont requises."
    return notify_user(
        user_id=user_id,
        email=email,
        title=title,
        body=body,
        link="/compte/dossiers",
        email_subject=f"[Ambassade RDC] {title} — {reference}",
    )


def notify_appointment(
    *,
    user_id: int | None,
    email: str | None,
    phone: str | None = None,
    reference: str,
    status: str,
    preferred_date: str,
    preferred_slot: str,
    kind: str = "update",
) -> NotifyResult:
    if kind == "reminder":
        title = "Rappel de rendez-vous"
        body = (
            f"Rappel : votre rendez-vous {reference} est prévu le {preferred_date} "
            f"({preferred_slot}). Présentez-vous avec vos documents."
        )
    elif status == "confirmed":
        title = "Rendez-vous confirmé"
        body = (
            f"Votre rendez-vous {reference} est confirmé pour le {preferred_date} "
            f"({preferred_slot}). Une convocation PDF est disponible dans votre espace."
        )
    elif status == "cancelled":
        title = "Rendez-vous annulé"
        body = f"Votre rendez-vous {reference} a été annulé."
    else:
        title = "Mise à jour rendez-vous"
        body = f"Statut du rendez-vous {reference} : {status}."
    channels: tuple[str, ...] = ("in_app", "email")
    if kind == "reminder" and getattr(settings, "NOTIFICATIONS_SMS_ENABLED", False):
        channels = ("in_app", "email", "sms")
    return notify_user(
        user_id=user_id,
        email=email,
        phone=phone,
        title=title,
        body=body,
        link="/compte/rendez-vous",
        channels=channels,
        email_subject=f"[Ambassade RDC] {title} — {reference}",
    )
