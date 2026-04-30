/**
 * SIDAN mock API.
 * Todas las funciones son async para que en el futuro puedan reemplazarse
 * por llamadas reales (REST, Firebase, etc.) sin tocar la UI.
 */
import type {
  AuditEvent,
  DashboardSummary,
  ModelVersion,
  SidanModel,
  SidanUser,
} from "@/types/sidan.types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const MODELS: SidanModel[] = [
  {
    id: "m1",
    name: "Cuenca_Rio_Grande.hms",
    type: "HEC-HMS",
    size: "2.4 MB",
    uploadedAt: "20/05/2025 10:15",
    status: "OK",
    hash: "8c3d2b6e1a7df6c4b2e9a1d7e3f2a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
    versions: [
      { id: "v1", label: "v1", date: "20/05/2025 10:15", status: "OK",
        params: { caudalPico: 320, volumenTotal: 1450, tiempoPico: 4.2, precipitacion: 65 } },
      { id: "v2", label: "v2 (alterada)", date: "20/05/2025 11:30", status: "Alterado",
        params: { caudalPico: 360, volumenTotal: 1497, tiempoPico: 4.3, precipitacion: 65 } },
      { id: "v3", label: "v3 (anómala)", date: "20/05/2025 12:05", status: "Anómalo",
        params: { caudalPico: 510, volumenTotal: 1980, tiempoPico: 5.6, precipitacion: 65 } },
    ],
  },
  {
    id: "m2", name: "Presa_San_Juan.iber", type: "Iber", size: "5.1 MB",
    uploadedAt: "20/05/2025 09:42", status: "OK",
    hash: "a1b2c3d4e5f60718293a4b5c6d7e8f9012345678abcdef1234567890abcdef12",
    versions: [
      { id: "v1", label: "v1", date: "20/05/2025 09:42", status: "OK",
        params: { caudalPico: 210, volumenTotal: 980, tiempoPico: 3.1, precipitacion: 48 } },
    ],
  },
  {
    id: "m3", name: "Canal_Principal.iber", type: "Iber", size: "3.8 MB",
    uploadedAt: "19/05/2025 16:21", status: "Anómalo",
    hash: "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    versions: [
      { id: "v1", label: "v1", date: "19/05/2025 16:21", status: "Anómalo",
        params: { caudalPico: 145, volumenTotal: 720, tiempoPico: 2.8, precipitacion: 32 } },
    ],
  },
  {
    id: "m4", name: "Embalse_Norte.hms", type: "HEC-HMS", size: "4.2 MB",
    uploadedAt: "18/05/2025 14:00", status: "Alterado",
    hash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    versions: [
      { id: "v1", label: "v1", date: "18/05/2025 14:00", status: "Alterado",
        params: { caudalPico: 410, volumenTotal: 1820, tiempoPico: 4.9, precipitacion: 72 } },
    ],
  },
  {
    id: "m5", name: "Microcuenca_Sur.hms", type: "HEC-HMS", size: "1.7 MB",
    uploadedAt: "17/05/2025 08:33", status: "Recuperado",
    hash: "deadbeefcafebabe1234567890abcdefdeadbeefcafebabe1234567890abcdef",
    versions: [
      { id: "v1", label: "v1", date: "17/05/2025 08:33", status: "Recuperado",
        params: { caudalPico: 180, volumenTotal: 640, tiempoPico: 2.4, precipitacion: 40 } },
    ],
  },
  ...Array.from({ length: 7 }).map<SidanModel>((_, i) => ({
    id: `m${6 + i}`,
    name: `Modelo_Auxiliar_${i + 1}.hms`,
    type: i % 2 === 0 ? "HEC-HMS" : "Iber",
    size: `${(1 + Math.random() * 4).toFixed(1)} MB`,
    uploadedAt: `1${i}/05/2025 09:00`,
    status: "OK",
    hash: Math.random().toString(16).slice(2).padEnd(64, "0"),
    versions: [
      { id: "v1", label: "v1", date: `1${i}/05/2025 09:00`, status: "OK",
        params: { caudalPico: 200, volumenTotal: 900, tiempoPico: 3, precipitacion: 50 } },
    ],
  })),
];

const EVENTS: AuditEvent[] = [
  { id: "e1", date: "20/05/2025 10:20", event: "Verificación completada", model: "Cuenca_Rio_Grande.hms", user: "Admin", status: "OK" },
  { id: "e2", date: "20/05/2025 10:15", event: "Modelo cargado", model: "Cuenca_Rio_Grande.hms", user: "Admin", status: "OK" },
  { id: "e3", date: "20/05/2025 09:42", event: "Verificación completada", model: "Presa_San_Juan.iber", user: "Admin", status: "OK" },
  { id: "e4", date: "20/05/2025 08:33", event: "Alteración simulada", model: "Cuenca_Rio_Grande.hms", user: "Admin", status: "Alterado" },
  { id: "e5", date: "19/05/2025 16:21", event: "Verificación completada", model: "Canal_Principal.iber", user: "Admin", status: "Anómalo" },
  { id: "e6", date: "19/05/2025 15:10", event: "Modelo recuperado", model: "Cuenca_Rio_Grande.hms", user: "Admin", status: "Recuperado" },
  { id: "e7", date: "18/05/2025 14:00", event: "Modelo cargado", model: "Embalse_Norte.hms", user: "Admin", status: "Alterado" },
  { id: "e8", date: "17/05/2025 08:33", event: "Modelo recuperado", model: "Microcuenca_Sur.hms", user: "Admin", status: "Recuperado" },
];

export async function login(username: string, password: string): Promise<SidanUser> {
  await delay();
  if (!username || !password) throw new Error("Credenciales requeridas");
  return { id: "u1", username, role: "Admin" };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await delay();
  return { total: 12, ok: 8, altered: 2, anomaly: 1, recovered: 1 };
}

export async function getModels(): Promise<SidanModel[]> {
  await delay();
  return MODELS;
}

export async function getModelById(id: string): Promise<SidanModel | undefined> {
  await delay();
  return MODELS.find((m) => m.id === id);
}

export async function getRecentEvents(): Promise<AuditEvent[]> {
  await delay();
  return EVENTS;
}

export async function getAuditEvents(): Promise<AuditEvent[]> {
  await delay();
  return EVENTS;
}

export async function uploadModel(file: { name: string; size: number }): Promise<SidanModel> {
  await delay(500);
  return {
    id: `m-${Date.now()}`,
    name: file.name,
    type: file.name.endsWith(".iber") ? "Iber" : "HEC-HMS",
    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    uploadedAt: new Date().toLocaleString("es-ES"),
    status: "OK",
    hash: Math.random().toString(16).slice(2).padEnd(64, "0"),
    versions: [],
  };
}

export async function compareVersions(a: ModelVersion, b: ModelVersion) {
  await delay();
  const diff = (k: keyof ModelVersion["params"]) => {
    const va = a.params[k]; const vb = b.params[k];
    const pct = va === 0 ? 0 : ((vb - va) / va) * 100;
    return { a: va, b: vb, diffPct: pct };
  };
  return {
    caudalPico: diff("caudalPico"),
    volumenTotal: diff("volumenTotal"),
    tiempoPico: diff("tiempoPico"),
    precipitacion: diff("precipitacion"),
  };
}

export async function simulateIncident(input: {
  modelId: string; parameter: string; magnitude: string;
}) {
  await delay(400);
  return { ok: true, newVersionId: `v-${Date.now()}`, ...input };
}

export async function recoverModel(modelId: string, versionId: string) {
  await delay(400);
  return { ok: true, modelId, versionId };
}
