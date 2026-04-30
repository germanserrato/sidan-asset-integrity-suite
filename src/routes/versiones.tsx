import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowUp, ArrowDown } from "lucide-react";
import { Layout } from "@/components/Layout";
import { compareVersions, getModels } from "@/services/sidanApi";
import type { ModelStatus, SidanModel } from "@/types/sidan.types";

export const Route = createFileRoute("/versiones")({
  head: () => ({ meta: [{ title: "Comparación de Versiones — SIDAN" }] }),
  component: VersionesPage,
});

type CompareResult = Awaited<ReturnType<typeof compareVersions>>;

function VersionesPage() {
  const [models, setModels] = useState<SidanModel[]>([]);
  const [modelId, setModelId] = useState<string>("");
  const [vA, setVA] = useState<string>("");
  const [vB, setVB] = useState<string>("");
  const [result, setResult] = useState<CompareResult | null>(null);

  useEffect(() => {
    getModels().then((m) => {
      setModels(m);
      const first = m.find((x) => x.versions.length >= 2) || m[0];
      if (first) {
        setModelId(first.id);
        setVA(first.versions[0]?.id || "");
        setVB(first.versions[1]?.id || first.versions[0]?.id || "");
      }
    });
  }, []);

  const model = useMemo(() => models.find((m) => m.id === modelId), [models, modelId]);

  const onCompare = async () => {
    if (!model) return;
    const a = model.versions.find((v) => v.id === vA);
    const b = model.versions.find((v) => v.id === vB);
    if (!a || !b) return;
    setResult(await compareVersions(a, b));
  };

  useEffect(() => { if (model && vA && vB) onCompare(); /* eslint-disable-next-line */ }, [model, vA, vB]);

  const conclusionStatus: ModelStatus = useMemo(() => {
    if (!result) return "OK";
    const max = Math.max(
      Math.abs(result.caudalPico.diffPct),
      Math.abs(result.volumenTotal.diffPct),
      Math.abs(result.tiempoPico.diffPct),
    );
    if (max > 10) return "Anómalo";
    if (max > 2) return "Alterado";
    return "OK";
  }, [result]);

  const rows: { label: string; key: keyof CompareResult; unit: string }[] = [
    { label: "Caudal Pico", key: "caudalPico", unit: "m³/s" },
    { label: "Volumen Total", key: "volumenTotal", unit: "m³" },
    { label: "Tiempo Pico", key: "tiempoPico", unit: "h" },
    { label: "Precipitación", key: "precipitacion", unit: "mm" },
  ];

  return (
    <Layout title="Comparación de Versiones" subtitle={model ? `Modelo: ${model.name}` : ""}>
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Modelo</label>
            <select value={modelId} onChange={(e) => { setModelId(e.target.value); setResult(null); }}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <ArrowLeftRight className="h-5 w-5 text-muted-foreground mb-2.5 hidden md:block" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Versión 1 (Base)</label>
              <select value={vA} onChange={(e) => setVA(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
                {model?.versions.map((v) => <option key={v.id} value={v.id}>{v.label} — {v.date}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Versión 2</label>
              <select value={vB} onChange={(e) => setVB(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
                {model?.versions.map((v) => <option key={v.id} value={v.id}>{v.label} — {v.date}</option>)}
              </select>
            </div>
          </div>
          <button onClick={onCompare}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            Comparar
          </button>
        </div>

        {result && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Resultado de la Comparación</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-2 font-medium">Parámetro</th>
                    <th className="pb-2 font-medium text-right">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const d = result[r.key];
                    const positive = d.diffPct > 0;
                    const zero = Math.abs(d.diffPct) < 0.01;
                    const tone = zero ? "text-muted-foreground" : positive ? "text-status-anomaly" : "text-status-ok";
                    return (
                      <tr key={r.key} className="border-b border-border/60">
                        <td className="py-3 text-foreground">{r.label} ({r.unit})</td>
                        <td className={`py-3 text-right font-medium ${tone}`}>
                          {zero ? "0%" : (
                            <span className="inline-flex items-center gap-1 justify-end">
                              {positive ? "+" : ""}{d.diffPct.toFixed(1)}%
                              {!zero && (positive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Conclusión</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Los resultados presentan diferencias significativas fuera de umbrales permitidos.
              </p>
              <div className={[
                "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border",
                conclusionStatus === "Anómalo" ? "bg-status-anomaly-soft text-status-anomaly border-status-anomaly/30" :
                conclusionStatus === "Alterado" ? "bg-status-altered-soft text-status-altered border-status-altered/30" :
                "bg-status-ok-soft text-status-ok border-status-ok/30",
              ].join(" ")}>
                Estado: {conclusionStatus}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
