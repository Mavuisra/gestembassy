/**
 * Client API public envelope { success, data, error }.
 */

export type ApiEnvelope<T> = {
 success: boolean;
 data: T | null;
 error: { message: string; code?: string; field?: string } | null;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

export class ApiRequestAbortedError extends Error {
 constructor() {
 super("Request aborted");
 this.name = "ApiRequestAbortedError";
 }
}

export async function apiGet<T>(
 path: string,
 locale = "fr",
 signal?: AbortSignal,
): Promise<T> {
 const separator = path.includes("?") ? "&" : "?";
 const response = await fetch(`${API_BASE}${path}${separator}locale=${locale}`, {
 signal,
 });
 if (signal?.aborted) {
 throw new ApiRequestAbortedError();
 }
 const json = (await response.json()) as ApiEnvelope<T>;
 if (!response.ok || !json.success || json.data === null) {
 throw new Error(json.error?.message ?? "Erreur API");
 }
 return json.data;
}

async function parseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
 const text = await response.text();
 try {
 return JSON.parse(text) as ApiEnvelope<T>;
 } catch {
 throw new Error(
 response.ok
 ? "Réponse serveur invalide."
 : `Erreur serveur (${response.status}). Réessayez ou contactez l'administrateur.`,
 );
 }
}

export async function apiPost<T>(
 path: string,
 body: unknown,
 signal?: AbortSignal,
): Promise<T> {
 const response = await fetch(`${API_BASE}${path}`, {
 method: "POST",
 headers: { "Content-Type": "application/json", Accept: "application/json" },
 body: JSON.stringify(body),
 signal,
 });
 if (signal?.aborted) {
 throw new ApiRequestAbortedError();
 }
 const json = await parseEnvelope<T>(response);
 if (!response.ok || !json.success || json.data === null) {
 throw new Error(json.error?.message ?? "Erreur API");
 }
 return json.data;
}

function authHeaders(token: string): HeadersInit {
 return {
 "Content-Type": "application/json",
 Accept: "application/json",
 Authorization: `Token ${token}`,
 };
}

export async function apiAuthGet<T>(path: string, token: string, signal?: AbortSignal): Promise<T> {
 const response = await fetch(`${API_BASE}${path}`, {
 headers: authHeaders(token),
 signal,
 });
 if (signal?.aborted) throw new ApiRequestAbortedError();
 const json = await parseEnvelope<T>(response);
 if (!response.ok || !json.success || json.data === null) {
 throw new Error(json.error?.message ?? "Erreur API");
 }
 return json.data;
}

export async function apiAuthPost<T>(
 path: string,
 token: string,
 body: unknown,
 signal?: AbortSignal,
): Promise<T> {
 const response = await fetch(`${API_BASE}${path}`, {
 method: "POST",
 headers: authHeaders(token),
 body: JSON.stringify(body),
 signal,
 });
 if (signal?.aborted) throw new ApiRequestAbortedError();
 const json = await parseEnvelope<T>(response);
 if (!response.ok || !json.success || json.data === null) {
 throw new Error(json.error?.message ?? "Erreur API");
 }
 return json.data;
}

export async function apiAuthPatch<T>(
 path: string,
 token: string,
 body: unknown,
 signal?: AbortSignal,
): Promise<T> {
 const response = await fetch(`${API_BASE}${path}`, {
 method: "PATCH",
 headers: authHeaders(token),
 body: JSON.stringify(body),
 signal,
 });
 if (signal?.aborted) throw new ApiRequestAbortedError();
 const json = await parseEnvelope<T>(response);
 if (!response.ok || !json.success || json.data === null) {
 throw new Error(json.error?.message ?? "Erreur API");
 }
 return json.data;
}

export async function apiAuthUpload<T>(
 path: string,
 token: string,
 formData: FormData,
 signal?: AbortSignal,
): Promise<T> {
 const response = await fetch(`${API_BASE}${path}`, {
 method: "POST",
 headers: {
 Accept: "application/json",
 Authorization: `Token ${token}`,
 },
 body: formData,
 signal,
 });
 if (signal?.aborted) throw new ApiRequestAbortedError();
 const json = await parseEnvelope<T>(response);
 if (!response.ok || !json.success || json.data === null) {
 throw new Error(json.error?.message ?? "Erreur API");
 }
 return json.data;
}

export type VisaDocumentMeta = {
 id: number;
 doc_type: string;
 original_name: string;
 content_type: string;
 size_bytes: number;
 uploaded_at: string | null;
};

export type VisaPreApplication = {
 id: number;
 reference: string;
 status: string;
 visa_type: string;
 nom: string;
 post_nom: string;
 prenom: string;
 date_naissance: string;
 nationalite: string;
 sexe: string;
 email: string;
 telephone: string;
 passeport_numero: string;
 passeport_delivre_le: string;
 passeport_expire_le: string;
 passeport_delivre_par: string;
 date_entree_prevue: string;
 date_sortie_prevue: string;
 motif_voyage: string;
 lieu_destination: string;
 hebergement_type: string;
 hebergement_adresse: string;
 hebergement_contact: string;
 locale: string;
 created_at: string;
 documents?: VisaDocumentMeta[];
 message?: string;
};

export function isAbortError(error: unknown): boolean {
 return (
 error instanceof ApiRequestAbortedError ||
 (error instanceof DOMException && error.name === "AbortError") ||
 (error instanceof Error && error.name === "AbortError")
 );
}

export type NewsItem = {
 slug: string;
 category: string;
 title: string;
 summary: string;
 published_at: string | null;
 is_provisional: boolean;
};

export type NewsDetail = NewsItem & {
 body: string;
};

export type ServiceItem = {
 slug: string;
 title: string;
 summary: string;
 requires_account: boolean;
 is_provisional: boolean;
 tariff_note: string;
 delay_note: string;
};

export type ServiceDetail = ServiceItem & {
 conditions: string;
 documents: string;
};

export type VisaItem = {
 slug: string;
 title: string;
 description: string;
 eligibility: string;
 documents: string;
 tariff_note: string;
 validity_note: string;
 is_provisional: boolean;
};

export type FaqItem = {
 id: number;
 category: string;
 question: string;
 answer: string;
 is_provisional: boolean;
};
