"""Envoie les rappels de rendez-vous (PHASE 8) — à planifier en cron."""

from __future__ import annotations

from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.accounts.models import Appointment
from infrastructure.notifications.service import notify_appointment


class Command(BaseCommand):
    help = "Envoie les rappels e-mail/SMS pour les RDV confirmés dans N jours."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=None,
            help="Jours avant le RDV (défaut: APPOINTMENT_REMINDER_DAYS)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Affiche les RDV ciblés sans envoyer.",
        )

    def handle(self, *args, **options):
        days = options["days"]
        if days is None:
            days = getattr(settings, "APPOINTMENT_REMINDER_DAYS", 1)
        target = (timezone.localdate() + timedelta(days=days)).isoformat()
        qs = (
            Appointment.objects.select_related("user")
            .filter(status="confirmed", preferred_date=target)
            .order_by("preferred_slot")
        )
        count = 0
        for appt in qs:
            self.stdout.write(f"{appt.reference} → {appt.user.email} ({appt.preferred_date})")
            if options["dry_run"]:
                continue
            phone = ""
            profile = getattr(appt.user, "citizen_profile", None)
            if profile is not None:
                phone = profile.telephone or ""
            notify_appointment(
                user_id=appt.user_id,
                email=appt.user.email,
                phone=phone,
                reference=appt.reference,
                status=appt.status,
                preferred_date=appt.preferred_date,
                preferred_slot=appt.preferred_slot,
                kind="reminder",
            )
            count += 1
        self.stdout.write(self.style.SUCCESS(f"Rappels traités : {count} (cible {target})"))
