"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    setIsLoading(true);

    const result = await subscribeToNewsletter(email, "WEBSITE");

    if (result.success) {
      setIsSuccess(true);
      setEmail("");
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <CheckCircle2 className="h-4 w-4" />
        <span>¡Gracias por suscribirte!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            disabled={isLoading}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading} size="sm">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Suscribir"
          )}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Recibe ofertas, códigos promocionales y novedades. Puedes darte de baja en cualquier momento.
      </p>
    </form>
  );
}
