export type ModelStatus = "OK" | "Alterado" | "Anómalo" | "Recuperado";

export type EventType =
  | "Modelo cargado"
  | "Verificación completada"
  | "Alteración simulada"
  | "Modelo recuperado";

export interface SidanModel {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: ModelStatus;
  hash: string;
  versions: ModelVersion[];
}

export interface ModelVersion {
  id: string;
  label: string;
  date: string;
  status: ModelStatus;
  params: {
    caudalPico: number;
    volumenTotal: number;
    tiempoPico: number;
    precipitacion: number;
  };
}

export interface AuditEvent {
  id: string;
  date: string;
  event: EventType;
  model: string;
  user: string;
  status: ModelStatus;
}

export interface SidanUser {
  id: string;
  username: string;
  role: "Admin" | "Analista" | "Auditor";
}

export interface DashboardSummary {
  total: number;
  ok: number;
  altered: number;
  anomaly: number;
  recovered: number;
}
