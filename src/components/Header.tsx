import { Bell, ChevronDown } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-card">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-accent text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-anomaly" />
        </button>
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-accent">
          <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">AI</div>
          <span className="text-sm font-medium text-foreground">Admin</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
