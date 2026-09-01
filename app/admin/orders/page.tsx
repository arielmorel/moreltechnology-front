import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-muted-foreground">
          Administra los pedidos de clientes.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <h3 className="font-medium">Próximamente</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            El módulo de pedidos se integrará con el sistema de facturación.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
