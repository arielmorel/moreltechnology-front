"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Command } from "cmdk";
import { Search, Laptop, Store, CornerDownLeft } from "lucide-react";
import { searchProducts } from "@/lib/api";
import { Product } from "@/lib/data";
import { isMinioImage, productUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      // Search both branches in parallel
      const [morel, mts] = await Promise.all([
        searchProducts(q, 0, 5, undefined, "moreltechnology"),
        searchProducts(q, 0, 5, undefined, "mts"),
      ]);
      // Merge and deduplicate by product id
      const all = [...morel.products, ...mts.products];
      const seen = new Set<string>();
      const unique = all.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      setResults(unique.slice(0, 8));
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 250);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    router.push(productUrl(slug));
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Buscar laptops"
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
    >
      <div className="fixed inset-x-0 top-[15vh] mx-auto w-full max-w-lg px-4">
        <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar laptop por nombre, marca..."
            className="w-full px-5 py-4 text-base bg-transparent border-b border-border/50 outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            {isLoading && (
              <Command.Loading>
                <div className="py-8 text-center text-sm text-muted-foreground">Buscando...</div>
              </Command.Loading>
            )}

            {!isLoading && query.length >= 2 && results.length === 0 && (
              <Command.Empty>
                <div className="py-8 text-center space-y-2">
                  <Search className="w-8 h-8 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No se encontraron resultados para &quot;{query}&quot;</p>
                </div>
              </Command.Empty>
            )}

            <Command.Group heading="Resultados">
              {results.map((product) => (
                <Command.Item
                  key={product.id}
                  value={`${product.name} ${product.brand}`}
                  onSelect={() => handleSelect(product.slug)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors aria-selected:bg-primary/10"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      unoptimized={isMinioImage(product.images[0])}
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{product.brand}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-semibold text-primary">RD$ {product.price.toLocaleString("es-DO")}</span>
                    </div>
                  </div>
                  <CornerDownLeft className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                </Command.Item>
              ))}
            </Command.Group>

            {results.length > 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border/50">
                {results.length} resultado{results.length !== 1 ? "s" : ""}
              </div>
            )}
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↵</kbd>
                abrir
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">esc</kbd>
              cerrar
            </span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}
