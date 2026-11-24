"""Tests — pré-demandes de visa + pièces (PHASE 6.4 / 6.8)."""

from __future__ import annotations

from application.use_cases import (
    AttachVisaDocument,
    FinalizeVisaPreApplication,
    GetVisaPreApplication,
    ListVisaPreApplications,
    SubmitVisaPreApplication,
    ValidationError,
)
from domain.entities import VisaDocumentUploadCommand, VisaPreApplicationCommand


def _cmd(**overrides) -> VisaPreApplicationCommand:
    base = dict(
        user_id=1,
        visa_type="touristique",
        nom="Kim",
        post_nom="Lee",
        prenom="Sora",
        date_naissance="1990-01-15",
        nationalite="Coréenne",
        sexe="F",
        email="sora@example.com",
        telephone="+82 10-1111-2222",
        passeport_numero="M12345678",
        passeport_delivre_le="2020-01-01",
        passeport_expire_le="2030-01-01",
        passeport_delivre_par="Seoul",
        date_entree_prevue="2026-06-01",
        date_sortie_prevue="2026-06-15",
        motif_voyage="Tourisme",
        lieu_destination="Kinshasa",
        hebergement_type="Hôtel",
        hebergement_adresse="Av. Exemple 1",
        hebergement_contact="+243 000",
        accept_conditions=False,
        locale="fr",
    )
    base.update(overrides)
    return VisaPreApplicationCommand(**base)


class FakeVisaRepo:
    def __init__(self) -> None:
        self.items: list[dict] = []
        self.docs: dict[str, set[str]] = {}

    def create(self, command: VisaPreApplicationCommand) -> dict:
        item = {
            "id": len(self.items) + 1,
            "reference": f"VISA-TEST-{len(self.items) + 1:03d}",
            "status": "draft",
            "visa_type": command.visa_type,
            "nom": command.nom,
            "email": command.email,
            "documents": [],
        }
        self.items.append(item)
        self.docs[item["reference"]] = set()
        return item

    def list_for_user(self, user_id: int) -> list[dict]:
        return list(self.items)

    def get_for_user(self, user_id: int, reference: str) -> dict | None:
        for item in self.items:
            if item["reference"] == reference:
                return item
        return None

    def save_document(
        self,
        user_id: int,
        reference: str,
        *,
        doc_type: str,
        original_name: str,
        content_type: str,
        size_bytes: int,
        file_bytes: bytes,
    ) -> dict:
        self.docs.setdefault(reference, set()).add(doc_type)
        meta = {
            "id": len(self.docs[reference]),
            "doc_type": doc_type,
            "original_name": original_name,
            "content_type": content_type,
            "size_bytes": size_bytes,
            "uploaded_at": None,
        }
        app = self.get_for_user(user_id, reference)
        if app is not None:
            app["documents"] = [d for d in app.get("documents", []) if d["doc_type"] != doc_type]
            app["documents"].append(meta)
        return meta

    def list_document_types(self, user_id: int, reference: str) -> list[str]:
        return list(self.docs.get(reference, set()))

    def finalize(self, user_id: int, reference: str) -> dict:
        app = self.get_for_user(user_id, reference)
        assert app is not None
        app["status"] = "submitted"
        app["accept_conditions"] = True
        return app


def test_create_draft_without_accept():
    repo = FakeVisaRepo()
    result = SubmitVisaPreApplication(repo).execute(_cmd())
    assert result["status"] == "draft"
    assert result["reference"].startswith("VISA-")


def test_attach_document_and_finalize():
    repo = FakeVisaRepo()
    draft = SubmitVisaPreApplication(repo).execute(_cmd())
    pdf = b"%PDF-1.4 fake"
    for doc_type, name in (("passport", "passeport.pdf"), ("photo", "photo.jpg")):
        AttachVisaDocument(repo).execute(
            VisaDocumentUploadCommand(
                user_id=1,
                reference=draft["reference"],
                doc_type=doc_type,
                original_name=name,
                content_type="application/pdf" if name.endswith(".pdf") else "image/jpeg",
                size_bytes=len(pdf),
                file_bytes=pdf,
            )
        )
    finalized = FinalizeVisaPreApplication(repo).execute(
        1, draft["reference"], accept_conditions=True
    )
    assert finalized["status"] == "submitted"


def test_finalize_rejects_missing_docs():
    repo = FakeVisaRepo()
    draft = SubmitVisaPreApplication(repo).execute(_cmd())
    try:
        FinalizeVisaPreApplication(repo).execute(1, draft["reference"], accept_conditions=True)
        assert False
    except ValidationError as exc:
        assert exc.field == "documents"


def test_attach_rejects_bad_format():
    repo = FakeVisaRepo()
    draft = SubmitVisaPreApplication(repo).execute(_cmd())
    try:
        AttachVisaDocument(repo).execute(
            VisaDocumentUploadCommand(
                user_id=1,
                reference=draft["reference"],
                doc_type="passport",
                original_name="virus.exe",
                content_type="application/octet-stream",
                size_bytes=10,
                file_bytes=b"1234567890",
            )
        )
        assert False
    except ValidationError as exc:
        assert exc.field == "file"


def test_list_and_get():
    repo = FakeVisaRepo()
    created = SubmitVisaPreApplication(repo).execute(_cmd())
    listed = ListVisaPreApplications(repo).execute(1)
    assert len(listed) == 1
    detail = GetVisaPreApplication(repo).execute(1, created["reference"])
    assert detail["reference"] == created["reference"]


def test_get_missing_raises():
    repo = FakeVisaRepo()
    try:
        GetVisaPreApplication(repo).execute(1, "VISA-MISSING")
        assert False
    except ValidationError as exc:
        assert exc.field == "reference"
