import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Copy, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { getModels } from "@/services/sidanApi";
import type { SidanModel } from "@/types/sidan.types";

export const Route = createFileRoute("/verificacion")({
  head: () => ({ meta: [{ title: "Verificación — SIDAN" }] }),
  component: VerificacionPage,
});

function VerificacionPage() {
  const [models, setModels] = useState<SidanModel[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null);

  useEffect(() => {
    getModels().then((m) => { setModels(m); setSelectedId(m[0]?.id || ""); });
  }, []);

  const m = models.find((x) => x.id === selectedId);

  const verify = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 600));
    setVerifying(false);
    setVerifiedAt(new Date().toLocaleString("es-ES"));
  };

  return (
    <Layout title="Detalle del Modelo" subtitle={m ? `Modelos › ${m.name}` : ""}>
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-5">
          <label className="text-xs text-muted-foreground">Modelo</label>
          <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setVerifiedAt(null); }}
            className="w-full md:w-1/2 mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
            {models.map((mm) => <option key={mm.id} value={mm.id}>{mm.name}</option>)}
          </select>
        </div>

        {m && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Información del Modelo</h3>
                <dl className="space-y-2 text-sm">
                  <Row k="Nombre:" v={m.name} />
                  <Row k="Tipo:" v={m.type} />
                  <Row k="Tamaño:" v={m.size} />
                  <Row k="Fecha de carga:" v={m.uploadedAt} />
                  <Row k="Estado actual:" v={<StatusBadge status={m.status} />} />
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Huella Digital (SHA-256)</h3>
                <div className="bg-muted rounded-md p-3 flex items-start gap-2 font-mono text-xs break-all text-foreground">
                  <span className="flex-1">{m.hash}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(m.hash); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    className="text-muted-foreground hover:text-foreground shrink-0">
                    {copied ? <Check className="h-4 w-4 text-status-ok" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-muted/40 rounded-md p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Resumen de Validación</h3>
                <dl className="space-y-1.5 text-sm">
                  <Row k="Última verificación:" v={verifiedAt || "20/05/2025 10:20"} />
                  <Row k="Resultado:" v={<StatusBadge status="OK" />} />
                  <Row k="Diferencia de hash:" v={<span className="text-status-ok font-medium">0%</span>} />
                  <Row k="Diferencia de resultados:" v={<span className="text-status-ok font-medium">0%</span>} />
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Acciones</h3>
                <div className="space-y-2">
                  <button onClick={verify} disabled={verifying}
                    className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {verifying ? "Verificando..." : "Verificar Modelo"}
                  </button>
                  <button className="w-full py-2.5 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary/5">
                    Comparar Versiones
                  </button>
                  <button className="w-full py-2.5 rounded-md border border-status-anomaly text-status-anomaly text-sm font-medium hover:bg-status-anomaly/5">
                    Simular Incidente
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="text-muted-foreground w-40 shrink-0">{k}</dt>
      <dd className="text-foreground">{v}</dd>
    </div>
  );
}
