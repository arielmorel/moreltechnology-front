import { Card, CardContent } from "@/components/ui/card";
import { CatalogSettings } from "@/components/admin/catalog-settings";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Ajustes generales del catálogo y panel de administración.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <CatalogSettings />
        </CardContent>
      </Card>
    </div>
  );
}
