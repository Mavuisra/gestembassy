"""Tests — réponse e-mail dossier (PHASE 7 UX)."""

from __future__ import annotations

from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from apps.accounts.models import StaffProfile, VisaPreApplication
from apps.accounts.case_utils import generate_case_reference


class RequestReplyTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(
            username="agent@test.local",
            email="agent@test.local",
            password="TestPass!2026",
            is_staff=True,
        )
        StaffProfile.objects.create(
            user=self.staff,
            role=StaffProfile.Role.CONSULAR,
            display_name="Agent Test",
        )
        self.token = Token.objects.create(user=self.staff)
        self.citizen = User.objects.create_user(
            username="citoyen@test.local",
            email="citoyen@test.local",
            password="Citoyen!2026",
        )
        self.visa = VisaPreApplication.objects.create(
            user=self.citizen,
            reference=generate_case_reference("VIS"),
            status="submitted",
            visa_type="tourisme",
            nom="Mbala",
            post_nom="K.",
            prenom="Jean",
            date_naissance="1990-01-01",
            nationalite="congolaise",
            sexe="M",
            email="citoyen@test.local",
            telephone="+821012345678",
            passeport_numero="OP123",
            passeport_delivre_le="2020-01-01",
            passeport_expire_le="2030-01-01",
            passeport_delivre_par="Kinshasa",
            date_entree_prevue="2026-06-01",
            date_sortie_prevue="2026-06-15",
            motif_voyage="Tourisme",
            lieu_destination="Kinshasa",
            hebergement_type="hotel",
            hebergement_adresse="Avenue 1",
            hebergement_contact="Hotel Central",
            accept_conditions=True,
        )
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_reply_sends_email_and_creates_timeline(self):
        url = f"/api/v1/backoffice/requests/visa/{self.visa.reference}/reply/"
        response = self.client.post(
            url,
            {
                "subject": "Complément d'information",
                "body": "Merci de nous transmettre une copie de votre billet d'avion.",
                "also_set_status": "needs_info",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertTrue(response.json()["success"])
        # 1 = réponse agent + 1 = notification changement de statut
        self.assertEqual(len(mail.outbox), 2)
        self.assertTrue(any(self.visa.reference in m.subject for m in mail.outbox))
        self.visa.refresh_from_db()
        self.assertEqual(self.visa.status, "needs_info")
