import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { boGet, boPatch } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { PageHeader, Panel, StatusBadge, fieldClass, formatDate } from "./ui";

type Appt = {
  reference: string;
  status: string;
  service_type: string;
  preferred_date: string;
  preferred_slot: string;
  notes: string;
  email?: string | null;
  applicant?: string | null;
  created_at?: string | null;
};

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function buildMonthCells(month: Date): (Date | null)[] {
  const first = startOfMonth(month);
  // JS: 0=Sun … convert so Monday=0
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function BackofficeAppointmentsPage() {
  const { token } = useStaffAuth();
  const [items, setItems] = useState<Appt[]>([]);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  function reload() {
    if (!token) return;
    boGet<Appt[]>("/appointments/", token)
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of items) {
      const key = (a.preferred_date || "").slice(0, 10);
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [items]);

  const cells = useMemo(() => buildMonthCells(month), [month]);
  const todayIso = toIsoDate(new Date());

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const date = (a.preferred_date || "").slice(0, 10);
      if (selectedDate && date !== selectedDate) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [items, selectedDate, statusFilter]);

  async function setStatus(reference: string, status: string) {
    if (!token) return;
    try {
      await boPatch(`/appointments/${reference}/`, token, { status });
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <div>
      <PageHeader
        title="Rendez-vous"
        subtitle="Filtrez par date sur le calendrier, puis confirmez ou annulez."
      />
      {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-5">
        <Panel className="xl:col-span-2" title="Calendrier">
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button"
              className="border border-line px-2 py-1.5 text-navy"
              aria-label="Mois précédent"
              onClick={() => setMonth((m) => addMonths(m, -1))}
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-sm font-bold capitalize text-navy">{monthLabel(month)}</p>
            <button
              type="button"
              className="border border-line px-2 py-1.5 text-navy"
              aria-label="Mois suivant"
              onClick={() => setMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-muted">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} className="min-h-14 border border-transparent" />;
              const iso = toIsoDate(day);
              const count = countsByDate.get(iso) || 0;
              const selected = selectedDate === iso;
              const isToday = iso === todayIso;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate((prev) => (prev === iso ? null : iso))}
                  className={`min-h-14 border p-1 text-left transition ${
                    selected
                      ? "border-navy bg-navy text-white"
                      : count > 0
                        ? "border-blue/40 bg-blue-soft/50 text-navy hover:border-navy"
                        : "border-line bg-white text-muted hover:border-navy/40"
                  }`}
                >
                  <span className={`block text-xs font-bold ${isToday && !selected ? "text-rdc-red" : ""}`}>
                    {day.getDate()}
                  </span>
                  {count > 0 ? (
                    <span className={`mt-1 block text-[10px] font-semibold ${selected ? "text-gold" : "text-navy"}`}>
                      {count} RDV
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="border border-line px-3 py-1.5 text-xs font-bold uppercase text-navy"
              onClick={() => setSelectedDate(null)}
            >
              Toutes les dates
            </button>
            {selectedDate ? (
              <span className="text-xs text-muted">
                Filtre : <strong className="text-navy">{selectedDate}</strong>
              </span>
            ) : (
              <span className="text-xs text-muted">Cliquez une date pour filtrer.</span>
            )}
          </div>
        </Panel>

        <div className="xl:col-span-3 space-y-4">
          <Panel>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={fieldClass + " mt-0 w-auto"}
              >
                <option value="">Tous les statuts</option>
                <option value="requested">Demandé</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Honoré</option>
              </select>
            </div>
          </Panel>

          <Panel
            title={
              selectedDate
                ? `${filtered.length} rendez-vous le ${selectedDate}`
                : `${filtered.length} rendez-vous`
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                    <th className="pb-2 font-bold">Référence</th>
                    <th className="pb-2 font-bold">Service</th>
                    <th className="pb-2 font-bold">Usager</th>
                    <th className="pb-2 font-bold">Créneau</th>
                    <th className="pb-2 font-bold">Statut</th>
                    <th className="pb-2 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.reference} className="border-b border-line/70 last:border-0">
                      <td className="py-3 font-semibold text-navy">{a.reference}</td>
                      <td className="py-3 text-muted">{a.service_type}</td>
                      <td className="py-3">
                        <div className="font-medium">{a.applicant || "…"}</div>
                        {a.email ? (
                          <a
                            href={`mailto:${a.email}?subject=Rendez-vous ${a.reference}`}
                            className="inline-flex items-center gap-1 text-xs text-navy underline"
                          >
                            <Mail size={11} />
                            {a.email}
                          </a>
                        ) : null}
                      </td>
                      <td className="py-3">
                        <div>
                          {a.preferred_date} · {a.preferred_slot}
                        </div>
                        <div className="text-xs text-muted">{formatDate(a.created_at)}</div>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-xs font-bold uppercase text-navy underline"
                            onClick={() => void setStatus(a.reference, "confirmed")}
                          >
                            Confirmer
                          </button>
                          <button
                            type="button"
                            className="text-xs font-bold uppercase text-rdc-red underline"
                            onClick={() => void setStatus(a.reference, "cancelled")}
                          >
                            Annuler
                          </button>
                          {a.email ? (
                            <a
                              href={`mailto:${a.email}?subject=Confirmation RDV ${a.reference}&body=Concernant votre rendez-vous ${a.reference} prévu le ${a.preferred_date} (${a.preferred_slot}).`}
                              className="text-xs font-bold uppercase text-muted underline"
                            >
                              Mail
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">Aucun rendez-vous pour ce filtre.</p>
              ) : null}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
