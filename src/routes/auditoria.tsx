import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { getAuditEvents } from "@/services/sidanApi";
import type { AuditEvent, EventType } from "@/types/sidan.types";

export const Route = createFileRoute("/auditoria")({
  head: () => ({ meta: [{ title: "Auditoría — SIDAN" }] }),
  component: AuditoriaPage,
});

const EVENT_TYPES: ("Todos" | EventType)[] = [
  "Todos", "Modelo cargado", "Verificación completada", "Alteración simulada", "Modelo recuperado",
];

// "20/05/2025 10:15" -> Date
function parseDate(s: string) {
  const [d, t] = s.split(" ");
  const [dd, mm, yyyy] = d.split("/").map(Number);
  const [hh, mi] = (t || "00:00").split(":").map(Number);
  return new Date(yyyy, mm - 1, dd, hh, mi);
}

function AuditoriaPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [type, setType] = useState<(typeof EVENT_TYPES)[number]>("Todos");
  const [user, setUser] = useState<string>("Todos");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  useEffect(() => { getAuditEvents().then(setEvents); }, []);

  const users = useMemo(() => ["Todos", ...Array.from(new Set(events.map((e) => e.user)))], [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (type !== "Todos" && e.event !== type) return false;
      if (user !== "Todos" && e.user !== user) return false;
      const d = parseDate(e.date);
      if (from && d < new Date(from)) return false;
      if (to && d > new Date(`${to}T23:59:59`)) return false;
      return true;
    });
  }, [events, type, user, from, to]);

  return (
    <Layout title="Auditoría / Historial de Eventos" subtitle="Registro de todas las actividades del sistema">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <div>
            <label className="text-xs text-muted-foreground">Usuario</label>
            <select value={user} onChange={(e) => setUser(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
              {users.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Tipo de Evento</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Fecha Desde</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Fecha Hasta</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm" />
          </div>
          <div className="flex items-end">
            <button onClick={() => { setType("Todos"); setUser("Todos"); setFrom(""); setTo(""); }}
              className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" /> Filtrar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Fecha</th>
                <th className="pb-2 font-medium">Evento</th>
                <th className="pb-2 font-medium">Modelo</th>
                <th className="pb-2 font-medium">Usuario</th>
                <th className="pb-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 text-muted-foreground">{e.date}</td>
                  <td className="py-2.5 text-foreground">{e.event}</td>
                  <td className="py-2.5 text-muted-foreground">{e.model}</td>
                  <td className="py-2.5 text-muted-foreground">{e.user}</td>
                  <td className="py-2.5"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                  No hay eventos que coincidan con los filtros.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
