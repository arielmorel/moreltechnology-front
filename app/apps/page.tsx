"use client";

import { useState, useMemo } from "react";
import { AppCard } from "@/components/app-card";
import { apps, appCategories } from "@/lib/data";
import { Smartphone, Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AppsPage() {
  const [selectedCategory, setSelectedCategory] = useState("todas");

  const filteredApps = useMemo(() => {
    if (selectedCategory === "todas") return apps;
    return apps.filter(
      (app) =>
        app.category === selectedCategory ||
        app.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

  const featuredApps = useMemo(
    () => filteredApps.filter((app) => app.featured),
    [filteredApps]
  );
  const otherApps = useMemo(
    () => filteredApps.filter((app) => !app.featured),
    [filteredApps]
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Smartphone className="w-4 h-4" />
            Nuestras Apps
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Innovación que llevamos de la <span className="text-primary">idea a la aplicación</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            En Morel Technology desarrollamos aplicaciones móviles para aprender conjugación de verbos en múltiples idiomas. 
            Más de 100,000 descargas y 4.2★ de rating promedio en Google Play.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {appCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="px-3 py-1 text-sm cursor-pointer transition-all"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "todas" ? "Todos" : category}
            </Badge>
          ))}
        </div>

        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tight mb-2">Destacadas</h2>
              <p className="text-sm text-muted-foreground">Nuestras aplicaciones más populares.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* Other Apps */}
        <section className="mb-20">
          {featuredApps.length > 0 && (
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">Todas las Apps</h2>
              <Badge variant="secondary" className="text-sm">
                {otherApps.length} apps
              </Badge>
            </div>
          )}
          {otherApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-3xl">
              <p className="text-muted-foreground">No se encontraron apps en esta categoría.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5 rounded-3xl text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">¿No encuentras lo que buscas?</h2>
            <p className="text-muted-foreground">
              Contáctanos y sugiere la próxima aplicación que deberíamos desarrollar.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">4.2★</span>
                <span>Rating promedio</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="w-4 h-4" />
                <span className="font-medium">100K+</span>
                <span>Descargas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "Morel Technology Apps",
              description: "Aplicaciones móviles para aprender conjugación de verbos en 6 idiomas.",
              applicationCategory: "Education",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.2",
                ratingCount: "5000",
              },
              operatingSystem: "Android",
              url: "https://moreltechnologyrd.com/apps",
            }),
          }}
        />
      </div>
    </div>
  );
}
