import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, FlaskConical } from "lucide-react";
import { Layout } from "@/components/Layout";
import { getModels, simulateIncident } from "@/services/sidanApi";
import type { SidanModel } from "@/types/sidan.types";

export const Route = createFileRoute("/simulacion")({
  head: () => ({ meta: [{ title: "Simulación de Incidente — SIDAN" }] }),
  component: SimulacionPage,
});

const PARAMS = [
  "Modificar parámetro (número de curva)",
  "Modificar precipitación",
  "Modificar caudal base",
  "Alterar geometría",
];
const MAGS = ["+10%", "+20%", "+50%", "-10%", "-20%"];

function SimulacionPage() {
  const [models, setModels] = useState<SidanModel[]>([]);
  const [modelId, setModelId] = useState("");
  const [param, setParam] = useState(PARAMS[0]);
  const [magnitude, setMagnitude] = useState("+20%");
  const [result, setResult] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => { getModels().then((m) => { setModels(m); setModelId(m[0]?.id || ""); }); }, []);

  const run = async () => {
    setRunning(true); setResult(null);
    const r = await simulateIncident({ modelId, parameter: param, magnitude });
    setRunning(false);
    setResult(`Nueva versión generada: ${r.newVersionId} — ${param} (${magnitude})`);
  };

  return (
    <Layout title="Simulación de Incidente" subtitle="Seleccione el modelo y el tipo de alteración">
      <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
        <div className="space-y-4">
          <Field label="Modelo">
            <select value={modelId} onChange={(e) => setModelId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Tipo de Alteración">
            <select value={param} onChange={(e) => setParam(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
              {PARAMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Magnitud del Cambio">
            <select value={magnitude} onChange={(e) => setMagnitude(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
              {MAGS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-md border border-status-altered/30 bg-status-altered-soft/40 p-3">
          <AlertTriangle className="h-4 w-4 text-status-altered shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Esta acción generará una nueva versión alterada del modelo para pruebas.
            No afecta la versión original.
          </p>
        </div>

        <button onClick={run} disabled={running}
          className="w-full mt-5 py-2.5 rounded-md bg-status-anomaly text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
          <FlaskConical className="h-4 w-4" />
          {running ? "Ejecutando..." : "Ejecutar Simulación"}
        </button>

        {result && (
          <div className="mt-4 rounded-md bg-status-ok-soft text-status-ok px-3 py-2 text-sm">{result}</div>
        )}
      </div>
    </Layout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
