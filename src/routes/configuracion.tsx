import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — SIDAN" }] }),
  component: ConfiguracionPage,
});

function ConfiguracionPage() {
  const [threshold, setThreshold] = useState(10);
  const [notify, setNotify] = useState(true);
  const [autoVerify, setAutoVerify] = useState(false);

  return (
    <Layout title="Configuración" subtitle="Ajustes generales del sistema">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Umbrales de Integridad</h2>
          <label className="text-sm text-muted-foreground">Diferencia máxima permitida (%)</label>
          <input type="range" min={1} max={50} value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full mt-3 accent-primary" />
          <p className="text-sm text-foreground mt-2">Umbral actual: <span className="font-semibold">{threshold}%</span></p>
        </section>

        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Preferencias</h2>
          <Toggle label="Notificaciones de anomalías" checked={notify} onChange={setNotify} />
          <Toggle label="Verificación automática diaria" checked={autoVerify} onChange={setAutoVerify} />
        </section>

        <section className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground mb-4">Cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Info k="Usuario" v="Admin" />
            <Info k="Rol" v="Administrador" />
            <Info k="Último acceso" v={new Date().toLocaleString("es-ES")} />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer">
      <span className="text-sm text-foreground">{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs text-muted-foreground">{k}</p>
      <p className="text-sm font-medium text-foreground mt-1">{v}</p>
    </div>
  );
}
