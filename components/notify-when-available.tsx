"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { subscribeToStockNotification } from "@/app/actions/stock-notifications";

interface NotifyWhenAvailableProps {
  productId: string;
  productName?: string;
}

export function NotifyWhenAvailable({
  productId,
  productName,
}: NotifyWhenAvailableProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!email.trim()) {
      setResult({ success: false, message: "El correo electrónico es requerido" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await subscribeToStockNotification(
        productId,
        name.trim() || undefined,
        email.trim()
      );
      setResult(response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset after close animation
    setTimeout(() => {
      setName("");
      setEmail("");
      setResult(null);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => (isOpen ? setOpen(true) : handleClose())}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="w-full rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
          />
        }
      >
        <Bell className="w-4 h-4 mr-2" />
        Avísame cuando esté disponible
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Notificarme cuando haya stock
          </DialogTitle>
          <DialogDescription>
            {productName
              ? `Te avisaremos por correo cuando "${productName}" vuelva a estar disponible.`
              : "Te avisaremos por correo cuando el producto vuelva a estar disponible."}
          </DialogDescription>
        </DialogHeader>

        {result?.success ? (
          <div className="py-6 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-600">{result.message}</p>
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-xl"
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notify-name" className="text-sm font-medium">
                Nombre <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="notify-name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notify-email" className="text-sm font-medium">
                Correo electrónico <span className="text-destructive">*</span>
              </Label>
              <Input
                id="notify-email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                disabled={isLoading}
                required
              />
            </div>

            {result && !result.success && (
              <p className="text-sm text-destructive">{result.message}</p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Avísame
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
