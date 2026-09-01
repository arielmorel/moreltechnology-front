"use client";

import * as React from "react";
import { Package, ShoppingCart, Users, Star, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/app/actions/admin-reviews";

interface Stats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Productos",
      value: "—",
      icon: Package,
      description: "Integración pendiente",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pedidos",
      value: "0",
      icon: ShoppingCart,
      description: "Sin pedidos registrados",
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
    {
      title: "Clientes",
      value: "0",
      icon: Users,
      description: "Sin datos disponibles",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      title: "Reseñas pendientes",
      value: String(stats?.pendingReviews ?? 0),
      icon: Star,
      description: `${stats?.totalReviews ?? 0} reseñas en total`,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Ventas",
      value: "RD$ 0",
      icon: TrendingUp,
      description: "Sin datos de ventas",
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
        <p className="text-muted-foreground">
          Vista general del sistema. Algunas secciones están pendientes de integración.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reviews summary */}
      {stats && stats.totalReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resumen de Reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approvedReviews}</div>
                <p className="text-xs text-muted-foreground">Aprobadas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejectedReviews}</div>
                <p className="text-xs text-muted-foreground">Rechazadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {stats && stats.totalReviews === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-medium">Sin reseñas todavía</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando los clientes envíen reseñas, aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
