import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { getModels, recoverModel } from "@/services/sidanApi";
import type { SidanModel } from "@/types/sidan.types";

export const Route = createFileRoute("/recuperacion")({
  head: () => ({ meta: [{ title: "Recuperación de Modelo — SIDAN" }] }),
  component: RecuperacionPage,
});

function RecuperacionPage() {
  const [models, setModels] = useState<SidanModel[]>([]);
  const [modelId, setModelId] = useState("");
  const [versionId, setVersionId] = useState("");
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    getModels().then((m) => {
      setModels(m);
      const first = m.find((x) => x.versions.length > 0) || m[0];
      if (first) { setModelId(first.id); setVersionId(first.versions[0]?.id || ""); }
    });
  }, []);

  const model = models.find((m) => m.id === modelId);

  const restore = async () => {
    if (!model || !versionId) return;
    await recoverModel(model.id, versionId);
    const v = model.versions.find((x) => x.id === versionId);
    setDone(`Modelo "${model.name}" restaurado a versión ${v?.label}.`);
  };

  return (
    <Layout title="Recuperación de Modelo" subtitle="Seleccione la versión válida para restaurar">
      <div className="bg-card rounded-xl border border-border p-6 max-w-3xl">
        <label className="text-xs text-muted-foreground">Modelo</label>
        <select value={modelId} onChange={(e) => { setModelId(e.target.value); setDone(null); }}
          className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm">
          {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <h3 className="text-sm font-semibold text-foreground mt-6 mb-3">Versiones disponibles</h3>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Versión</th>
                <th className="px-3 py-2 font-medium">Fecha</th>
                <th className="px-3 py-2 font-medium">Estado</th>
                <th className="px-3 py-2 font-medium text-right">Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {model?.versions.map((v) => (
                <tr key={v.id} className="border-t border-border">
                  <td className="px-3 py-2.5 text-foreground">{v.label}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{v.date}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={v.status} /></td>
                  <td className="px-3 py-2.5 text-right">
                    <input type="radio" name="ver" checked={versionId === v.id}
                      onChange={() => setVersionId(v.id)} className="accent-primary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={restore}
          className="w-full mt-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          Restaurar Versión Seleccionada
        </button>

        {done && <div className="mt-4 rounded-md bg-status-recovered-soft text-status-recovered px-3 py-2 text-sm">{done}</div>}
      </div>
    </Layout>
  );
}
