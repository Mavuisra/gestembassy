"""Génération PDF + QR Code (convocation rendez-vous)."""

from __future__ import annotations

import io
from pathlib import Path

import qrcode
from django.conf import settings
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


def build_verification_payload(reference: str) -> str:
    base = getattr(settings, "PUBLIC_APP_URL", "http://localhost:5173").rstrip("/")
    return f"{base}/compte/rendez-vous?ref={reference}"


def generate_qr_png(payload: str) -> bytes:
    img = qrcode.make(payload)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def generate_appointment_pdf(
    *,
    reference: str,
    applicant: str,
    email: str,
    service_type: str,
    preferred_date: str,
    preferred_slot: str,
    status: str,
) -> bytes:
    payload = build_verification_payload(reference)
    qr_bytes = generate_qr_png(payload)

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(25 * mm, height - 25 * mm, "Ambassade de la RDC — Seoul")
    c.setFont("Helvetica", 11)
    c.drawString(25 * mm, height - 33 * mm, "Convocation / Confirmation de rendez-vous")

    y = height - 50 * mm
    lines = [
        f"Reference : {reference}",
        f"Statut : {status}",
        f"Demandeur : {applicant}",
        f"E-mail : {email}",
        f"Service : {service_type}",
        f"Date souhaitee : {preferred_date}",
        f"Creneau : {preferred_slot}",
        "",
        "Presentez cette convocation (PDF ou QR) le jour du rendez-vous.",
        "Document generique — ne constitue pas une decision consulaire.",
    ]
    c.setFont("Helvetica", 11)
    for line in lines:
        c.drawString(25 * mm, y, line)
        y -= 7 * mm

    qr_path = Path(settings.MEDIA_ROOT) / "tmp"
    qr_path.mkdir(parents=True, exist_ok=True)
    tmp_file = qr_path / f"qr-{reference}.png"
    tmp_file.write_bytes(qr_bytes)
    c.drawImage(str(tmp_file), 25 * mm, 35 * mm, width=40 * mm, height=40 * mm, mask="auto")
    c.setFont("Helvetica", 8)
    c.drawString(25 * mm, 30 * mm, payload[:90])
    c.showPage()
    c.save()
    try:
        tmp_file.unlink(missing_ok=True)
    except OSError:
        pass
    return buf.getvalue()
