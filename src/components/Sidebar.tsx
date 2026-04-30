import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Database, GitBranch, ShieldCheck,
  FlaskConical, RefreshCcw, ClipboardList, Settings, ShieldAlert,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/modelos", label: "Modelos", icon: Database },
  { to: "/versiones", label: "Versiones", icon: GitBranch },
  { to: "/verificacion", label: "Verificación", icon: ShieldCheck },
  { to: "/simulacion", label: "Simulación", icon: FlaskConical },
  { to: "/recuperacion", label: "Recuperación", icon: RefreshCcw },
  { to: "/auditoria", label: "Auditoría", icon: ClipboardList },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-sidebar-border">
        <ShieldAlert className="h-6 w-6 text-sidebar-accent-foreground" />
        <span className="text-lg font-semibold tracking-wide">SIDAN</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-border/40 hover:text-sidebar-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-3 text-xs text-sidebar-foreground/50 border-t border-sidebar-border">
        v1.0 · SIDAN
      </div>
    </aside>
  );
}
