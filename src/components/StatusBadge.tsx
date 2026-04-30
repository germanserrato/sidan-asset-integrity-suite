import type { ModelStatus } from "@/types/sidan.types";

const map: Record<ModelStatus, string> = {
  OK: "bg-status-ok-soft text-status-ok",
  Alterado: "bg-status-altered-soft text-status-altered",
  Anómalo: "bg-status-anomaly-soft text-status-anomaly",
  Recuperado: "bg-status-recovered-soft text-status-recovered",
};

export function StatusBadge({ status }: { status: ModelStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}
