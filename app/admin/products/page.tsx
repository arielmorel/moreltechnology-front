import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
        <p className="text-muted-foreground">
          Gestiona el catálogo de productos.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <h3 className="font-medium">Próximamente</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            La gestión de productos se integrará con el sistema de billing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
