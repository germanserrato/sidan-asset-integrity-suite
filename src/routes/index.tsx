import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, Eye, EyeOff, User, Lock } from "lucide-react";
import { login } from "@/services/sidanApi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIDAN — Sistema de Integridad y Defensa de Activos Numéricos" },
      { name: "description", content: "Inicie sesión en SIDAN para gestionar la integridad de modelos numéricos." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username || "admin", password || "admin");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40"
        style={{ background: "radial-gradient(ellipse at top left, oklch(0.92 0.06 250) 0%, transparent 50%), radial-gradient(ellipse at bottom right, oklch(0.94 0.04 200) 0%, transparent 50%)" }} />
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 rounded-xl bg-brand text-brand-foreground grid place-items-center mb-4">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SIDAN</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de Integridad y<br />Defensa de Activos Numéricos
          </p>
          <p className="text-xs text-muted-foreground mt-3">Inicie sesión para continuar</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="w-full pl-10 pr-3 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-10 pr-10 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="button" onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-input" />
            Recordarme
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
