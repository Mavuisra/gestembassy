/**
 * Client API back-office même enveloppe { success, data, error }.
 */

import { ApiRequestAbortedError, type ApiEnvelope } from "./client";
import { clearStaffSession } from "../auth/staffStorage";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

export class StaffSessionExpiredError extends Error {
  constructor(message = "Session expirée. Reconnectez-vous.") {
    super(message);
    this.name = "StaffSessionExpiredError";
  }
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

function headers(token?: string): HeadersInit {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) h.Authorization = `Token ${token}`;
  return h;
}

export const STAFF_AUTH_EXPIRED_EVENT = "ambadrcor:staff-auth-expired";

function handleAuthFailure(response: Response, json: ApiEnvelope<unknown>): never {
  if (response.status === 401) {
    clearStaffSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(STAFF_AUTH_EXPIRED_EVENT));
    }
    throw new StaffSessionExpiredError(json.error?.message ?? "Session expirée. Reconnectez-vous.");
  }
  throw new Error(json.error?.message ?? "Erreur API");
}

export async function boPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}/backoffice${path}`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  const json = await parseEnvelope<T>(response);
  if (!response.ok || !json.success || json.data === null) {
    handleAuthFailure(response, json);
  }
  return json.data;
}

export async function boGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE}/backoffice${path}`, {
    headers: headers(token),
  });
  if (response.status === 0) throw new ApiRequestAbortedError();
  const json = await parseEnvelope<T>(response);
  if (!response.ok || !json.success || json.data === null) {
    handleAuthFailure(response, json);
  }
  return json.data;
}

export async function boPatch<T>(path: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}/backoffice${path}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  const json = await parseEnvelope<T>(response);
  if (!response.ok || !json.success || json.data === null) {
    handleAuthFailure(response, json);
  }
  return json.data;
}

export function boDocumentUrl(documentId: number): string {
  return `${API_BASE}/backoffice/documents/${documentId}/download/`;
}
