"use client";

import * as React from "react";
import { StockNotificationStatus } from "@prisma/client";
import {
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
  Mail,
  User,
  Calendar,
  Package,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  getAdminStockNotifications,
  updateStockNotificationStatus,
} from "@/app/actions/admin-stock-notifications";

type Notification = {
  id: string;
  productId: string;
  customerName: string | null;
  customerEmail: string;
  status: StockNotificationStatus;
  notifiedAt: Date | null;
  createdAt: Date;
};

const filters: { label: string; value: "ALL" | StockNotificationStatus }[] = [
  { label: "Todas", value: "ALL" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Notificados", value: "NOTIFIED" },
  { label: "Cancelados", value: "CANCELLED" },
  { label: "Fallidos", value: "FAILED" },
];

const statusConfig: Record<
  StockNotificationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendiente",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  NOTIFIED: {
    label: "Notificado",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
  FAILED: {
    label: "Fallido",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

function NotificationStatusBadge({ status }: { status: StockNotificationStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | StockNotificationStatus>("ALL");
  const [counts, setCounts] = React.useState({
    total: 0,
    pending: 0,
    notified: 0,
    cancelled: 0,
    failed: 0,
  });
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    notificationId: string;
    action: StockNotificationStatus;
    customerName: string;
  }>({ open: false, notificationId: "", action: "NOTIFIED", customerName: "" });

  const loadNotifications = React.useCallback(async (filter: "ALL" | StockNotificationStatus) => {
    setIsLoading(true);
    try {
      const status = filter === "ALL" ? undefined : filter;
      const data = await getAdminStockNotifications(status);
      setNotifications(data.notifications as Notification[]);
      setCounts({
        total: data.total,
        pending: data.pendingCount,
        notified: data.notifiedCount,
        cancelled: data.cancelledCount,
        failed: data.failedCount,
      });
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications(activeFilter);
  }, [activeFilter, loadNotifications]);

  const handleAction = (notificationId: string, action: StockNotificationStatus, customerName: string) => {
    setConfirmDialog({ open: true, notificationId, action, customerName });
  };

  const confirmAction = async () => {
    setActionLoading(confirmDialog.notificationId);
    try {
      const result = await updateStockNotificationStatus(confirmDialog.notificationId, confirmDialog.action);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === confirmDialog.notificationId
              ? {
                  ...n,
                  status: confirmDialog.action,
                  ...(confirmDialog.action === "NOTIFIED" ? { notifiedAt: new Date() } : {}),
                }
              : n
          )
        );
        setCounts((prev) => {
          const updated = { ...prev };
          const notification = notifications.find((n) => n.id === confirmDialog.notificationId);
          if (notification) {
            if (notification.status === "PENDING") updated.pending--;
            if (notification.status === "NOTIFIED") updated.notified--;
            if (notification.status === "CANCELLED") updated.cancelled--;
            if (notification.status === "FAILED") updated.failed--;
            if (confirmDialog.action === "PENDING") updated.pending++;
            if (confirmDialog.action === "NOTIFIED") updated.notified++;
            if (confirmDialog.action === "CANCELLED") updated.cancelled++;
            if (confirmDialog.action === "FAILED") updated.failed++;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    } finally {
      setActionLoading(null);
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-DO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notificaciones de Stock</h2>
        <p className="text-muted-foreground">
          Gestiona las solicitudes de notificación cuando productos vuelvan a estar disponibles.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {filters.map((f) => {
          const count =
            f.value === "ALL"
              ? counts.total
              : f.value === "PENDING"
              ? counts.pending
              : f.value === "NOTIFIED"
              ? counts.notified
              : f.value === "CANCELLED"
              ? counts.cancelled
              : counts.failed;
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeFilter === f.value
                    ? "bg-primary-foreground/20"
                    : "bg-foreground/10"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-medium">
              {activeFilter === "ALL"
                ? "Sin notificaciones"
                : `Sin notificaciones ${filters.find((f) => f.value === activeFilter)?.label.toLowerCase()}`}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeFilter === "ALL"
                ? "Cuando los clientes soliciten notificaciones, aparecerán aquí."
                : "No hay notificaciones con este filtro."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <NotificationStatusBadge status={notification.status} />
                    </div>

                    {/* Product */}
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Producto #{notification.productId}
                      </span>
                      <a
                        href={`/productos/${notification.productId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {notification.customerName && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notification.customerName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {notification.customerEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.notifiedAt && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Notificado: {formatDate(notification.notifiedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {notification.status === "PENDING" && (
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
                        onClick={() =>
                          handleAction(notification.id, "NOTIFIED", notification.customerName || "Cliente")
                        }
                        disabled={actionLoading === notification.id}
                      >
                        {actionLoading === notification.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">Marcar notificado</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                        onClick={() =>
                          handleAction(notification.id, "CANCELLED", notification.customerName || "Cliente")
                        }
                        disabled={actionLoading === notification.id}
                      >
                        {actionLoading === notification.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">Cancelar</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={
          confirmDialog.action === "NOTIFIED"
            ? "Marcar como notificado"
            : "Cancelar notificación"
        }
        description={
          confirmDialog.action === "NOTIFIED"
            ? `¿Marcar la notificación de ${confirmDialog.customerName} como enviada?`
            : `¿Cancelar la notificación de ${confirmDialog.customerName}?`
        }
        confirmLabel={
          confirmDialog.action === "NOTIFIED" ? "Notificar" : "Cancelar"
        }
        variant={confirmDialog.action === "CANCELLED" ? "destructive" : "default"}
        onConfirm={confirmAction}
        isLoading={actionLoading !== null}
      />
    </div>
  );
}
