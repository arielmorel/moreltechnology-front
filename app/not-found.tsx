import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | Morel Technology",
  description: "La página que buscas no existe o fue movida. Explora nuestro catálogo de laptops en República Dominicana.",
  alternates: {
    canonical: "/404",
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 text-center space-y-8 max-w-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl">
          <Search className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold">Página no encontrada</h2>
          <p className="text-muted-foreground text-lg">
            Lo sentimos, la página que buscas no existe o fue movida a otra ubicación.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="rounded-full font-medium h-12 px-8 shadow-lg"
            nativeButton={false}
            render={<Link href="/" className="flex items-center gap-2" />}
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full font-medium h-12 px-8"
            nativeButton={false}
            render={<Link href="/catalogo" className="flex items-center gap-2" />}
          >
            Ver catálogo
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
