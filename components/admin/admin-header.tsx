"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Productos",
  "/admin/orders": "Pedidos",
  "/admin/customers": "Clientes",
  "/admin/reviews": "Reseñas",
  "/admin/settings": "Configuración",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            0
          </span>
        </button>
      </div>
    </header>
  );
}
