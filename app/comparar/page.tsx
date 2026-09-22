"use client";

import { useCart, useCartHydrated } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Cpu, MemoryStick, HardDrive, ShieldCheck, DollarSign, Trash2, Monitor, Sparkles, ArrowLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { isMinioImage, productUrl } from "@/lib/utils";

export default function CompararPage() {
  const { compareItems, removeFromCompare, clearCompare, addItem } = useCart();
  const hydrated = useCartHydrated();

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (compareItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6">
          <ArrowRightLeft className="w-9 h-9 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-3">Comparador de equipos</h1>
        <p className="text-muted-foreground mb-8">
          Seleccioná hasta 3 equipos con el botón de comparar y se mostrarán aquí lado a lado.
        </p>
        <Link href="/catalogo/moreltechnology">
          <Button className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
            Explorar catálogo
            <ArrowLeft className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const rows = [
    { key: "price", label: "Precio", icon: DollarSign },
    { key: "processor", label: "Procesador", icon: Cpu },
    { key: "ram", label: "RAM", icon: MemoryStick },
    { key: "ssd", label: "Disco", icon: HardDrive },
    { key: "gpu", label: "GPU", icon: Sparkles },
    { key: "screenSize", label: "Pantalla", icon: Monitor },
    { key: "condition", label: "Estado", icon: ShieldCheck },
  ] as const;

  const renderCell = (key: string, item: typeof compareItems[number]) => {
    switch (key) {
      case "price":
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl md:text-2xl font-black text-primary">
              US${item.price.toLocaleString("en-US")}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-muted-foreground line-through">
                US${item.originalPrice.toLocaleString("en-US")}
              </span>
            )}
          </div>
        );
      case "condition":
        return <Badge variant="secondary">{item.condition}</Badge>;
      default:
        return <span className="font-medium">{String(item[key as keyof typeof item] ?? "—")}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Comparativa técnica
          </p>
          <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-primary" />
            Comparar {compareItems.length} {compareItems.length === 1 ? "equipo" : "equipos"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Podés comparar hasta 3 equipos al mismo tiempo.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={clearCompare}
          className="text-muted-foreground hover:text-destructive border border-border/40 rounded-2xl gap-2 self-start"
        >
          <Trash2 className="w-4 h-4" />
          Limpiar comparación
        </Button>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 md:p-6 text-left w-40 align-bottom"></th>
                {compareItems.map(item => (
                  <th key={item.id} className="p-4 md:p-6 min-w-[220px] align-top">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-muted border border-border/50">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          unoptimized={isMinioImage(item.images[0])}
                          sizes="(max-width: 768px) 128px, 160px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                          {item.brand}
                        </Badge>
                        <h3 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h3>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map((row, rowIndex) => (
                <tr
                  key={row.key}
                  className={
                    rowIndex % 2 === 1 ? "bg-muted/20" : "bg-background"
                  }
                >
                  <td className="p-4 md:p-5 font-bold text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <row.icon className="w-4 h-4 text-primary/70" />
                      {row.label}
                    </span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className={`p-4 md:p-5 text-center ${row.key === "price" ? "bg-primary/[0.03]" : ""}`}>
                      {renderCell(row.key, item)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-muted/30">
                <td className="p-4 md:p-5 font-bold text-muted-foreground"></td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-4 md:p-5">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        className="w-full rounded-xl font-bold"
                        disabled={item.quantity <= 0}
                        onClick={() => addItem(item)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Agregar al carrito
                      </Button>
                      <Link href={productUrl(item.slug)} prefetch={true} className="w-full">
                        <Button variant="outline" className="w-full rounded-xl">
                          Ver detalle
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCompare(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Quitar
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}