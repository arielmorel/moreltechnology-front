"use client";

import * as React from "react";
import { ReviewStatus } from "@prisma/client";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  Filter,
  Mail,
  User,
  Calendar,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { StarRating } from "@/components/admin/star-rating";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getAdminReviews, updateReviewStatus } from "@/app/actions/admin-reviews";

type Review = {
  id: string;
  productId: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  createdAt: Date;
};

const filters: { label: string; value: "ALL" | ReviewStatus }[] = [
  { label: "Todas", value: "ALL" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Aprobadas", value: "APPROVED" },
  { label: "Rechazadas", value: "REJECTED" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | ReviewStatus>("ALL");
  const [counts, setCounts] = React.useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    reviewId: string;
    action: "APPROVED" | "REJECTED";
    customerName: string;
  }>({ open: false, reviewId: "", action: "APPROVED", customerName: "" });

  const loadReviews = React.useCallback(async (filter: "ALL" | ReviewStatus) => {
    setIsLoading(true);
    try {
      const status = filter === "ALL" ? undefined : filter;
      const data = await getAdminReviews(status);
      setReviews(data.reviews as Review[]);
      setCounts({
        total: data.total,
        pending: data.pendingCount,
        approved: data.approvedCount,
        rejected: data.rejectedCount,
      });
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadReviews(activeFilter);
  }, [activeFilter, loadReviews]);

  const handleAction = (reviewId: string, action: "APPROVED" | "REJECTED", customerName: string) => {
    setConfirmDialog({ open: true, reviewId, action, customerName });
  };

  const confirmAction = async () => {
    setActionLoading(confirmDialog.reviewId);
    try {
      const result = await updateReviewStatus(confirmDialog.reviewId, confirmDialog.action);
      if (result.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === confirmDialog.reviewId
              ? { ...r, status: confirmDialog.action }
              : r
          )
        );
        setCounts((prev) => {
          const updated = { ...prev };
          const review = reviews.find((r) => r.id === confirmDialog.reviewId);
          if (review) {
            if (review.status === "PENDING") updated.pending--;
            if (review.status === "APPROVED") updated.approved--;
            if (review.status === "REJECTED") updated.rejected--;
            if (confirmDialog.action === "APPROVED") updated.approved++;
            if (confirmDialog.action === "REJECTED") updated.rejected++;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error updating review:", error);
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
        <h2 className="text-2xl font-bold tracking-tight">Reseñas</h2>
        <p className="text-muted-foreground">
          Gestiona las reseñas de productos. Revisa, aprueba o rechaza las opiniones de clientes.
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
              : f.value === "APPROVED"
              ? counts.approved
              : counts.rejected;
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

      {/* Reviews list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Star className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-medium">
              {activeFilter === "ALL"
                ? "Sin reseñas"
                : `Sin reseñas ${filters.find((f) => f.value === activeFilter)?.label.toLowerCase()}`}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeFilter === "ALL"
                ? "Cuando los clientes envíen reseñas, aparecerán aquí."
                : "No hay reseñas con este filtro."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={review.status} />
                      <StarRating rating={review.rating} />
                      {review.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <ShieldCheck className="h-3 w-3" />
                          Compra verificada
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    {review.title && (
                      <h4 className="font-semibold">{review.title}</h4>
                    )}

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {review.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {review.customerEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Producto #{review.productId}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {review.status === "PENDING" && (
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
                        onClick={() =>
                          handleAction(review.id, "APPROVED", review.customerName)
                        }
                        disabled={actionLoading === review.id}
                      >
                        {actionLoading === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">Aprobar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                        onClick={() =>
                          handleAction(review.id, "REJECTED", review.customerName)
                        }
                        disabled={actionLoading === review.id}
                      >
                        {actionLoading === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">Rechazar</span>
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
          confirmDialog.action === "APPROVED"
            ? "Aprobar reseña"
            : "Rechazar reseña"
        }
        description={
          confirmDialog.action === "APPROVED"
            ? `¿Aprobar la reseña de ${confirmDialog.customerName}? Será visible públicamente.`
            : `¿Rechazar la reseña de ${confirmDialog.customerName}? No será visible públicamente.`
        }
        confirmLabel={
          confirmDialog.action === "APPROVED" ? "Aprobar" : "Rechazar"
        }
        variant={confirmDialog.action === "REJECTED" ? "destructive" : "default"}
        onConfirm={confirmAction}
        isLoading={actionLoading !== null}
      />
    </div>
  );
}
