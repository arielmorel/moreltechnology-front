"use client";

import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

type FilterId = "all" | "laptops" | "gaming" | "accesorios" | "budget";
type SortId = "savings" | "percent" | "price_asc" | "price_desc";

const BUDGET_LIMIT = 25_000;

const FILTERS: { id: FilterId; label: string; match: (p: Product) => boolean }[] = [
  { id: "all", label: "Todas", match: () => true },
  { id: "laptops", label: "Laptops", match: (p) => p.category === "laptop" || p.category === "laptops" },
  {
    id: "gaming",
    label: "Gaming",
    match: (p) =>
      p.category.includes("gaming") ||
      p.tags.some((t) => /gam(er|ing)/i.test(t)) ||
      /gaming|nitro|tuf|rog|legion|omen|predator/i.test(p.name),
  },
  { id: "accesorios", label: "Accesorios", match: (p) => p.category === "accesorios" },
  {
    id: "budget",
    label: `Menos de RD$ ${BUDGET_LIMIT.toLocaleString("es-DO")}`,
    match: (p) => p.price < BUDGET_LIMIT,
  },
];

const SORTS: { id: SortId; label: string }[] = [
  { id: "savings", label: "Mayor ahorro" },
  { id: "percent", label: "Mayor % de descuento" },
  { id: "price_asc", label: "Precio: menor a mayor" },
  { id: "price_desc", label: "Precio: mayor a menor" },
];

const savingsOf = (p: Product) => (p.originalPrice ?? p.price) - p.price;
const percentOf = (p: Product) => (p.originalPrice ? savingsOf(p) / p.originalPrice : 0);

const SORTERS: Record<SortId, (a: Product, b: Product) => number> = {
  savings: (a, b) => savingsOf(b) - savingsOf(a),
  percent: (a, b) => percentOf(b) - percentOf(a),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
};

export function BlackFridayDeals({ deals }: { deals: Product[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("savings");

  const availableFilters = useMemo(
    () =>
      FILTERS.map((f) => ({ ...f, count: deals.filter(f.match).length })).filter(
        (f) => f.id === "all" || (f.count > 0 && f.count < deals.length)
      ),
    [deals]
  );

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
    return deals.filter(active.match).sort(SORTERS[sort]);
  }, [deals, filter, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 [scrollbar-width:none]">
          <SlidersHorizontal className="ml-1 hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
          {availableFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
                filter === f.id
                  ? "border-red-500 bg-red-500 text-white shadow-md shadow-red-500/20"
                  : "border-border bg-background text-foreground hover:border-red-500/50 hover:text-red-600"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-bold tabular-nums",
                  filter === f.id ? "bg-white/20" : "bg-muted text-muted-foreground"
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ArrowDownWideNarrow className="h-4 w-4 shrink-0" />
          <span className="sr-only md:not-sr-only">Ordenar:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="h-9 w-full rounded-full border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 md:w-auto"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        Mostrando <span className="font-bold text-foreground">{visible.length}</span> de{" "}
        {deals.length} ofertas
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} showSavings />
        ))}
      </div>
    </div>
  );
}
