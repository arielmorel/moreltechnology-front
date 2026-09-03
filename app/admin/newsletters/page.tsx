"use client";

import * as React from "react";
import { SubscriberStatus } from "@prisma/client";
import {
  Loader2,
  Mail,
  Calendar,
  Filter,
  UserCheck,
  UserX,
  Globe,
  ShoppingCart,
  MessageCircle,
  Video,
  Users,
  Camera,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  getNewsletterSubscribers,
  type NewsletterSubscriberData,
} from "@/app/actions/admin-newsletter";

const filters: { label: string; value: "ALL" | SubscriberStatus }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Suscritos", value: "SUBSCRIBED" },
  { label: "No suscritos", value: "UNSUBSCRIBED" },
];

const sourceConfig: Record<string, { label: string; icon: React.ElementType }> = {
  WEBSITE: { label: "Sitio Web", icon: Globe },
  CHECKOUT: { label: "Checkout", icon: ShoppingCart },
  INSTAGRAM: { label: "Instagram", icon: Camera },
  FACEBOOK: { label: "Facebook", icon: Globe },
  WHATSAPP: { label: "WhatsApp", icon: MessageCircle },
  TIKTOK: { label: "TikTok", icon: Video },
  REFERAL: { label: "Referido", icon: Users },
};

export default function AdminNewslettersPage() {
  const [subscribers, setSubscribers] = React.useState<NewsletterSubscriberData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | SubscriberStatus>("ALL");
  const [counts, setCounts] = React.useState({ total: 0, subscribed: 0, unsubscribed: 0 });

  const loadSubscribers = React.useCallback(async (filter: "ALL" | SubscriberStatus) => {
    setIsLoading(true);
    try {
      const status = filter === "ALL" ? undefined : filter;
      const data = await getNewsletterSubscribers(status);
      setSubscribers(data.subscribers);
      setCounts({
        total: data.total,
        subscribed: data.subscribedCount,
        unsubscribed: data.unsubscribedCount,
      });
    } catch (error) {
      console.error("Error loading subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSubscribers(activeFilter);
  }, [activeFilter, loadSubscribers]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-DO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceInfo = (source: string) => {
    return sourceConfig[source] || { label: source, icon: Globe };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Newsletter</h2>
        <p className="text-muted-foreground">
          Gestiona los suscriptores al boletín informativo.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {filters.map((f) => {
          const count =
            f.value === "ALL"
              ? counts.total
              : f.value === "SUBSCRIBED"
              ? counts.subscribed
              : counts.unsubscribed;
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

      {/* Subscribers list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : subscribers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-medium">
              {activeFilter === "ALL"
                ? "Sin suscriptores"
                : `Sin suscriptores ${
                    filters.find((f) => f.value === activeFilter)?.label.toLowerCase()
                  }`}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeFilter === "ALL"
                ? "Cuando los usuarios se suscriban al newsletter, aparecerán aquí."
                : "No hay suscriptores con este filtro."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {subscribers.map((subscriber) => {
            const sourceInfo = getSourceInfo(subscriber.source);
            const SourceIcon = sourceInfo.icon;
            const isSubscribed = subscriber.status === "SUBSCRIBED";

            return (
              <Card key={subscriber.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Email and status */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {subscriber.email}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            isSubscribed
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {isSubscribed ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          {isSubscribed ? "Suscrito" : "No suscrito"}
                        </span>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <SourceIcon className="h-3 w-3" />
                          {sourceInfo.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Suscrito: {formatDate(subscriber.subscribedAt)}
                        </span>
                        {subscriber.unsubscribedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Dado de baja: {formatDate(subscriber.unsubscribedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
