import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        <p className="text-muted-foreground">
          Visualiza y gestiona la información de clientes.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <h3 className="font-medium">Próximamente</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            El módulo de clientes se integrará con el sistema de cuentas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
