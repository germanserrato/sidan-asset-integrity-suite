import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Database, CheckCircle2, AlertTriangle, AlertOctagon, RefreshCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { getDashboardSummary, getRecentEvents } from "@/services/sidanApi";
import type { AuditEvent, DashboardSummary } from "@/types/sidan.types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SIDAN" }] }),
  component: DashboardPage,
});

const cards = [
  { key: "total", label: "Modelos Totales", sub: "Todos los modelos registrados", icon: Database, tone: "text-foreground", iconBg: "bg-primary/10 text-primary" },
  { key: "ok", label: "OK", sub: "Modelos íntegros", icon: CheckCircle2, tone: "text-status-ok", iconBg: "bg-status-ok-soft text-status-ok" },
  { key: "altered", label: "Alterados", sub: "Modelos con cambios", icon: AlertTriangle, tone: "text-status-altered", iconBg: "bg-status-altered-soft text-status-altered" },
  { key: "anomaly", label: "Anómalos", sub: "Modelos fuera de umbral", icon: AlertOctagon, tone: "text-status-anomaly", iconBg: "bg-status-anomaly-soft text-status-anomaly" },
  { key: "recovered", label: "Recuperados", sub: "Modelos restaurados", icon: RefreshCcw, tone: "text-status-recovered", iconBg: "bg-status-recovered-soft text-status-recovered" },
] as const;

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
    getRecentEvents().then(setEvents);
  }, []);

  const pieData = summary ? [
    { name: "OK", value: summary.ok, color: "var(--status-ok)" },
    { name: "Alterados", value: summary.altered, color: "var(--status-altered)" },
    { name: "Anómalos", value: summary.anomaly, color: "var(--status-anomaly)" },
    { name: "Recuperados", value: summary.recovered, color: "var(--status-recovered)" },
  ] : [];
  const total = summary?.total ?? 0;

  return (
    <Layout title="Dashboard" subtitle="Resumen general del estado de integridad de los modelos">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((c) => {
          const value = summary ? (summary as any)[c.key] : "—";
          const Icon = c.icon;
          return (
            <div key={c.key} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${c.tone}`}>{value}</p>
                </div>
                <div className={`h-9 w-9 rounded-lg grid place-items-center ${c.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{c.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Estado de Integridad</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-foreground">{d.name} ({d.value})</span>
                </div>
                <span className="text-muted-foreground">{total ? ((d.value / total) * 100).toFixed(1) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Evento</th>
                  <th className="pb-2 font-medium">Modelo</th>
                  <th className="pb-2 font-medium">Fecha</th>
                  <th className="pb-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 6).map((e) => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 text-foreground">{e.event}</td>
                    <td className="py-2.5 text-muted-foreground">{e.model}</td>
                    <td className="py-2.5 text-muted-foreground">{e.date}</td>
                    <td className="py-2.5"><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
