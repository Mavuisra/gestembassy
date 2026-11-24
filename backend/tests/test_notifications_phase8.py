"""Tests — notifications multi-canal (PHASE 8)."""

from __future__ import annotations

from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from apps.accounts.models import Appointment, NotificationDelivery, UserNotification
from apps.accounts.case_utils import generate_case_reference
from infrastructure.notifications.service import notify_status_change, notify_user
from infrastructure.notifications.pdf_qr import generate_appointment_pdf, generate_qr_png


class NotificationServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="citoyen@test.local",
            email="citoyen@test.local",
            password="Citoyen!2026",
        )

    def test_notify_creates_in_app_and_email(self):
        result = notify_user(
            user_id=self.user.id,
            email=self.user.email,
            title="Test",
            body="Corps du message",
            link="/compte",
        )
        self.assertIsNotNone(result.in_app_id)
        self.assertTrue(UserNotification.objects.filter(user=self.user, title="Test").exists())
        self.assertEqual(len(mail.outbox), 1)
        self.assertTrue(NotificationDelivery.objects.filter(channel="email", success=True).exists())

    def test_status_change_needs_info_wording(self):
        notify_status_change(
            user_id=self.user.id,
            email=self.user.email,
            case_type="visa",
            reference="VIS-TEST",
            new_status="needs_info",
            note="Passeport manquant",
        )
        n = UserNotification.objects.filter(user=self.user).first()
        self.assertIsNotNone(n)
        self.assertIn("complémentaires", n.body)

    def test_qr_and_pdf_generation(self):
        png = generate_qr_png("https://example.com/rdv")
        self.assertTrue(png.startswith(b"\x89PNG"))
        pdf = generate_appointment_pdf(
            reference="RDV-1",
            applicant="Jean Test",
            email="citoyen@test.local",
            service_type="visa",
            preferred_date="2026-12-01",
            preferred_slot="morning",
            status="confirmed",
        )
        self.assertTrue(pdf.startswith(b"%PDF"))


class NotificationApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="citoyen2@test.local",
            email="citoyen2@test.local",
            password="Citoyen!2026",
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        UserNotification.objects.create(user=self.user, title="A", body="B", link="/compte")

    def test_unread_and_mark_all(self):
        r = self.client.get("/api/v1/account/notifications/unread-count/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["data"]["unread_count"], 1)
        r2 = self.client.post("/api/v1/account/notifications/read-all/", {}, format="json")
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()["data"]["updated"], 1)

    def test_appointment_pdf(self):
        appt = Appointment.objects.create(
            user=self.user,
            reference=generate_case_reference("RDV"),
            service_type="visa",
            preferred_date="2026-12-01",
            preferred_slot="morning",
            status="confirmed",
        )
        r = self.client.get(f"/api/v1/account/appointments/{appt.reference}/pdf/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r["Content-Type"], "application/pdf")
        self.assertTrue(r.content.startswith(b"%PDF"))


@override_settings(NOTIFICATIONS_SMS_ENABLED=True)
class SmsStubTests(TestCase):
    def test_sms_channel_simulated(self):
        user = User.objects.create_user(
            username="sms@test.local", email="sms@test.local", password="x"
        )
        result = notify_user(
            user_id=user.id,
            email=user.email,
            phone="+821012345678",
            title="SMS",
            body="Rappel RDV",
            channels=("sms",),
        )
        self.assertIsNotNone(result.sms)
        self.assertTrue(result.sms.get("ok"))
        self.assertTrue(result.sms.get("simulated"))
