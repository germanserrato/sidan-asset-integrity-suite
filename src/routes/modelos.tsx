import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { getModels, uploadModel } from "@/services/sidanApi";
import type { SidanModel } from "@/types/sidan.types";

export const Route = createFileRoute("/modelos")({
  head: () => ({ meta: [{ title: "Modelos — SIDAN" }] }),
  component: ModelosPage,
});

interface PendingFile { name: string; size: number; progress: number; done: boolean; }

function ModelosPage() {
  const [models, setModels] = useState<SidanModel[]>([]);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getModels().then(setModels); }, []);

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((f) => {
      const item: PendingFile = { name: f.name, size: f.size, progress: 0, done: false };
      setPending((p) => [...p, item]);
      const interval = setInterval(() => {
        setPending((curr) => curr.map((it) => {
          if (it.name !== item.name) return it;
          const next = Math.min(100, it.progress + 12 + Math.random() * 18);
          return { ...it, progress: next, done: next >= 100 };
        }));
      }, 180);
      setTimeout(async () => {
        clearInterval(interval);
        const m = await uploadModel({ name: f.name, size: f.size });
        setModels((curr) => [m, ...curr]);
        setPending((curr) => curr.map((it) => it.name === item.name ? { ...it, progress: 100, done: true } : it));
      }, 1600);
    });
  };

  return (
    <Layout title="Carga de Modelo" subtitle="Seleccione un archivo de modelo para registrar en el sistema">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Carga de Modelo</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={[
              "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            ].join(" ")}
          >
            <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">Arrastre y suelte su archivo aquí</p>
            <p className="text-xs text-muted-foreground mt-1">o haga clic para seleccionar</p>
            <input
              ref={inputRef} type="file" multiple accept=".hms,.iber" hidden
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">Formatos soportados: .hms, .iber</p>

          <div className="mt-4 space-y-2">
            {pending.map((p) => (
              <div key={p.name} className="border border-border rounded-md p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck2 className="h-4 w-4 text-status-ok shrink-0" />
                    <span className="truncate text-foreground">{p.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{(p.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button onClick={() => setPending((c) => c.filter((x) => x.name !== p.name))}
                    className="text-muted-foreground hover:text-foreground ml-2"><X className="h-4 w-4" /></button>
                </div>
                <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="w-full mt-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90">
            Cargar Modelo
          </button>
        </section>

        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Modelos Registrados</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Nombre</th>
                  <th className="pb-2 font-medium">Tipo</th>
                  <th className="pb-2 font-medium">Tamaño</th>
                  <th className="pb-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {models.slice(0, 8).map((m) => (
                  <tr key={m.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 text-foreground truncate max-w-[200px]">{m.name}</td>
                    <td className="py-2.5 text-muted-foreground">{m.type}</td>
                    <td className="py-2.5 text-muted-foreground">{m.size}</td>
                    <td className="py-2.5"><StatusBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
