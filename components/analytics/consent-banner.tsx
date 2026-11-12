"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setAnalyticsConsent, useAnalyticsConsent } from "@/lib/analytics/consent";

export function ConsentBanner() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const consent = useAnalyticsConsent();

  if (!mounted || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-background/95 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Tu privacidad, tu elección</p>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
              Usamos cookies y tecnologías similares para medir el rendimiento del sitio y mejorar
              nuestras campañas. Puedes aceptar o rechazar el uso de analítica y publicidad.{" "}
              <Link href="/privacidad" className="font-medium text-foreground underline underline-offset-2">
                Ver política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:pl-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAnalyticsConsent("denied")}
          >
            Rechazar
          </Button>
          <Button
            type="button"
            size="sm"
            className="gap-2"
            onClick={() => setAnalyticsConsent("granted")}
          >
            <ShieldCheck className="h-4 w-4" />
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
