"use client";

import { useState, useEffect } from "react";
import { getSettingWithDefault, saveSetting } from "@/lib/api";
import { Palette, Check, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type CatalogTheme = "theme-novus" | "theme-emerald" | "theme-midnight" | "theme-crimson" | "theme-amber";

const themes = [
  {
    id: "theme-novus" as CatalogTheme,
    name: "Novus Blue",
    description: "Tema estándar profesional y confiable.",
    colors: ["#4f8ef7", "#2563eb", "#93c5fd"],
  },
  {
    id: "theme-emerald" as CatalogTheme,
    name: "Emerald Garden",
    description: "Ideal para productos naturales o salud.",
    colors: ["#10b981", "#047857", "#6ee7b7"],
  },
  {
    id: "theme-midnight" as CatalogTheme,
    name: "Midnight Royal",
    description: "Experiencia premium y moderna.",
    colors: ["#6366f1", "#4338ca", "#a5b4fc"],
  },
  {
    id: "theme-crimson" as CatalogTheme,
    name: "Crimson Night",
    description: "Atrevido, elegante y con fuerza.",
    colors: ["#e11d48", "#0f172a", "#fb7185"],
  },
  {
    id: "theme-amber" as CatalogTheme,
    name: "Amber Sunset",
    description: "Cálido, enérgico y acogedor.",
    colors: ["#f59e0b", "#b45309", "#fcd34d"],
  },
];

const themeRingColors: Record<CatalogTheme, string> = {
  "theme-novus": "ring-blue-500",
  "theme-emerald": "ring-emerald-500",
  "theme-midnight": "ring-indigo-500",
  "theme-crimson": "ring-rose-500",
  "theme-amber": "ring-amber-500",
};

const themeBorderColors: Record<CatalogTheme, string> = {
  "theme-novus": "border-blue-200",
  "theme-emerald": "border-emerald-200",
  "theme-midnight": "border-indigo-200",
  "theme-crimson": "border-rose-200",
  "theme-amber": "border-amber-200",
};

const themeBgColors: Record<CatalogTheme, string> = {
  "theme-novus": "bg-blue-50",
  "theme-emerald": "bg-emerald-50",
  "theme-midnight": "bg-indigo-50",
  "theme-crimson": "bg-rose-50",
  "theme-amber": "bg-amber-50",
};

const themeCheckColors: Record<CatalogTheme, string> = {
  "theme-novus": "text-blue-600",
  "theme-emerald": "text-emerald-600",
  "theme-midnight": "text-indigo-600",
  "theme-crimson": "text-rose-600",
  "theme-amber": "text-amber-600",
};

export function CatalogSettings() {
  const [selectedTheme, setSelectedTheme] = useState<CatalogTheme>("theme-novus");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setIsLoading(true);
    try {
      const value = await getSettingWithDefault("appearance.theme", "theme-novus");
      setSelectedTheme(value as CatalogTheme);
    } catch {
      console.error("Error loading catalog theme");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetTheme = async (theme: CatalogTheme) => {
    if (theme === selectedTheme) return;
    
    setSelectedTheme(theme);
    setIsSaving(true);

    try {
      await saveSetting("appearance.theme", theme, "STRING", "APPEARANCE");
      toast.success("Apariencia del catálogo actualizada");
    } catch {
      console.error("Error saving catalog theme");
      setSelectedTheme(selectedTheme);
      toast.error("Error al actualizar la apariencia");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Identidad Visual</h3>
          <p className="text-sm text-muted-foreground">Selecciona el tema que mejor represente tu marca</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSetTheme(theme.id)}
              disabled={isSaving}
              className={cn(
                "relative group cursor-pointer rounded-2xl border-2 transition-all duration-300 p-4 text-left overflow-hidden",
                selectedTheme === theme.id
                  ? cn("bg-opacity-100 ring-2", themeBgColors[theme.id], themeRingColors[theme.id], themeBorderColors[theme.id])
                  : "bg-white border-gray-200 hover:border-gray-300",
                isSaving && "opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex flex-col gap-3">
                {/* Color Preview */}
                <div className="flex gap-1 h-10 rounded-lg overflow-hidden border border-gray-100">
                  {theme.colors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>

                {/* Theme Name + Check */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{theme.name}</span>
                  {selectedTheme === theme.id && (
                    <Check className={cn("w-5 h-5", themeCheckColors[theme.id])} />
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500">{theme.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Información</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>El tema seleccionado se aplicará a tu catálogo público</li>
              <li>Los cambios se reflejan inmediatamente en la tienda</li>
              <li>Puedes cambiar el tema en cualquier momento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
