import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Ajustes generales del panel de administración.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Settings className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <h3 className="font-medium">Próximamente</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            La configuración del panel se habilitará en futuras actualizaciones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
