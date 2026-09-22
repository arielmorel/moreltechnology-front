"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/data";
import { getProducts, PAGE_SIZE_ALL } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import { branches } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Briefcase,
  GraduationCap,
  Video,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
  Share2,
  CreditCard,
  ArrowUpDown,
  ExternalLink,
  Zap,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Step = "usage" | "budget" | "brand" | "results";
type ConditionFilter = "todas" | "nuevo" | "usado";
type ResultSort = "relevance" | "price_asc" | "price_desc";

const SITE_URL = "https://moreltechnologyrd.com";
const FINANCING_MONTHS = 12;

const usageOptions = [
  { id: "gaming", label: "Gaming", icon: Gamepad2, desc: "Juegos de alta gama y streaming", category: "gaming" },
  { id: "oficina", label: "Oficina", icon: Briefcase, desc: "Multitarea, Excel y videollamadas", category: "oficina" },
  { id: "estudio", label: "Estudio", icon: GraduationCap, desc: "Tareas, investigación y portabilidad", category: "estudiantes" },
  { id: "edicion", label: "Edición / Diseño", icon: Video, desc: "Adobe, Renderizado 3D y 4K", category: "diseno" },
];

// Rangos en DOP directo (el precio del catálogo está en RD$)
const budgetOptions = [
  { id: "under20", label: "Hasta RD$ 20k", range: [0, 20000], desc: "Laptops económicas y usadas" },
  { id: "low", label: "RD$ 20k - 40k", range: [20000, 40000], desc: "Económico y funcional" },
  { id: "mid", label: "RD$ 40k - 60k", range: [40000, 60000], desc: "Equilibrio potencia/precio" },
  { id: "high", label: "RD$ 60k+", range: [60000, Infinity], desc: "Rendimiento profesional" },
];

const stepOrder: Step[] = ["usage", "budget", "brand", "results"];

interface CompiledSelection {
  usage: string;
  budget: string;
  brand: string;
  condition: ConditionFilter;
}

const conditionOptions: { value: ConditionFilter; label: string }[] = [
  { value: "todas", label: "Todos" },
  { value: "nuevo", label: "Nuevos" },
  { value: "usado", label: "Usados" },
];

function matchesUsage(product: Product, usage: string): boolean {
  if (!usage) return true;
  const name = product.name.toLowerCase();
  const desc = product.description.toLowerCase();
  const processor = product.processor.toLowerCase();
  const ramGB = parseInt(product.ram, 10);
  const tags = product.tags.map(t => t.toLowerCase());

  if (usage === "gaming") {
    return tags.includes("gamer") ||
      /nvidia|geforce|rtx|gtx|radeon|gaming|gamer|zbook/.test(name + " " + desc);
  }
  if (usage === "edicion") {
    return product.brand === "Apple" ||
      /m[1234]/i.test(name) ||
      (ramGB >= 16 && (/i7|i9|ryzen 7|ryzen 9|core ultra/.test(processor) || !!product.gpu));
  }
  if (usage === "oficina") {
    return (product.category === "laptop" || product.category === "oficina") &&
      ramGB >= 8 &&
      /i3|i5|i7|ryzen/.test(processor);
  }
  if (usage === "estudio") {
    return (product.category === "laptop" || product.category === "oficina") && ramGB >= 8;
  }
  return true;
}

function matchesCondition(product: Product, condition: ConditionFilter): boolean {
  if (condition === "nuevo") return product.condition === "Nuevo";
  if (condition === "usado") return product.condition !== "Nuevo";
  return true;
}

function RecomendadorPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("usage");
  const [resultSort, setResultSort] = useState<ResultSort>("relevance");

  const initialSelections = useMemo<CompiledSelection>(() => {
    const usage = searchParams.get("uso") || "";
    const budget = searchParams.get("presupuesto") || "";
    const brand = searchParams.get("marca") || "";
    const rawCondition = searchParams.get("condicion");
    const condition: ConditionFilter =
      rawCondition === "nuevo" || rawCondition === "usado" ? rawCondition : "todas";
    return {
      usage: usageOptions.some(o => o.id === usage) ? usage : "",
      budget: budgetOptions.some(o => o.id === budget) ? budget : "",
      brand: brand || "todas",
      condition,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selections, setSelections] = useState<CompiledSelection>(initialSelections);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar TODO el catálogo paginando, solo productos en stock
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const all: Product[] = [];
      let page = 0;
      let total = Infinity;
      try {
        while (page * PAGE_SIZE_ALL < total) {
          const res = await getProducts(page, PAGE_SIZE_ALL, undefined, undefined, undefined, "IN_STOCK");
          all.push(...res.products);
          total = res.total;
          if (res.products.length < PAGE_SIZE_ALL) break;
          page++;
        }
      } catch (error) {
        console.error("Error cargando productos del recomendador:", error);
      }
      // Los más recientes primero (el backend no soporta sort=newest)
      all.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
      setProducts(all);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Sincronizar selecciones a la URL para compartir resultados
  useEffect(() => {
    const params = new URLSearchParams();
    if (selections.usage) params.set("uso", selections.usage);
    if (selections.budget) params.set("presupuesto", selections.budget);
    if (selections.brand && selections.brand !== "todas") params.set("marca", selections.brand);
    if (selections.condition !== "todas") params.set("condicion", selections.condition);
    const qs = params.toString();
    router.replace(qs ? `/recomendador?${qs}` : "/recomendador", { scroll: false });
  }, [selections, router]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map(p => p.brand));
    return Array.from(uniqueBrands).sort();
  }, [products]);

  const budgetOpt = useMemo(
    () => budgetOptions.find(o => o.id === selections.budget),
    [selections.budget]
  );
  const usageOpt = useMemo(
    () => usageOptions.find(o => o.id === selections.usage),
    [selections.usage]
  );

  const matchReason = (score: number): string => {
    if (score >= 5) return "Match perfecto";
    if (score >= 4) return "Muy buena opción";
    return "Buena opción";
  };

  const recommendations = useMemo(() => {
    if (step !== "results") return [];

    const matches = products.filter(product => {
      const matchesUsageFilter = matchesUsage(product, selections.usage);
      const matchesBudget =
        !budgetOpt ||
        (product.price >= budgetOpt.range[0] && product.price <= budgetOpt.range[1]);
      const matchesBrand = selections.brand === "todas" || product.brand === selections.brand;
      const matchesConditionFilter = matchesCondition(product, selections.condition);
      return matchesUsageFilter && matchesBudget && matchesBrand && matchesConditionFilter;
    });

    const scored = matches.map(product => {
      let score = 0;
      const tags = product.tags.map(t => t.toLowerCase());
      if (selections.usage === "gaming" && tags.includes("gamer")) score += 2;
      if (selections.brand && product.brand === selections.brand) score += 1;
      if (product.pinned || product.featured) score += 1;
      if (product.quantity > 0) score += 1;
      return { product, score };
    });

    if (resultSort === "price_asc") {
      scored.sort((a, b) => a.product.price - b.product.price);
    } else if (resultSort === "price_desc") {
      scored.sort((a, b) => b.product.price - a.product.price);
    } else {
      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aOnSale = a.product.originalPrice !== undefined ? 1 : 0;
        const bOnSale = b.product.originalPrice !== undefined ? 1 : 0;
        if (bOnSale !== aOnSale) return bOnSale - aOnSale;
        return a.product.price - b.product.price;
      });
    }

    return scored.slice(0, 8).map(({ product, score }) => ({
      product,
      reason: matchReason(score),
      score,
    }));
  }, [products, step, selections, budgetOpt, resultSort]);

  // Para sugerir "subir un poco el presupuesto" si no hay matches
  const nextBudgetOpt = useMemo(() => {
    const idx = budgetOptions.findIndex(o => o.id === selections.budget);
    return idx >= 0 && idx + 1 < budgetOptions.length ? budgetOptions[idx + 1] : null;
  }, [selections.budget]);

  const nextBudgetCount = useMemo(() => {
    if (step !== "results" || !nextBudgetOpt) return 0;
    return products.filter(p =>
      matchesUsage(p, selections.usage) &&
      matchesCondition(p, selections.condition) &&
      (selections.brand === "todas" || p.brand === selections.brand) &&
      p.price >= nextBudgetOpt.range[0] && p.price <= nextBudgetOpt.range[1]
    ).length;
  }, [products, step, selections, nextBudgetOpt]);

  const handleNext = () => {
    if (step === "usage") setStep("budget");
    else if (step === "budget") setStep("brand");
    else if (step === "brand") setStep("results");
  };

  const handleBack = () => {
    if (step === "budget") setStep("usage");
    else if (step === "brand") setStep("budget");
    else if (step === "results") setStep("brand");
  };

  const reset = () => {
    setSelections({ usage: "", budget: "", brand: "todas", condition: "todas" });
    setResultSort("relevance");
    setStep("usage");
  };

  const buildCatalogLink = () => {
    const params = new URLSearchParams();
    if (usageOpt) params.set("q", usageOpt.label);
    if (selections.brand && selections.brand !== "todas") params.set("brand", selections.brand);
    if (nextBudgetOpt || budgetOpt) {
      const range = budgetOpt?.range ?? [0, Infinity];
      if (range[0] > 0) params.set("priceMin", String(Math.round(range[0])));
      if (range[1] !== Infinity) params.set("priceMax", String(Math.round(range[1])));
    }
    if (selections.condition !== "todas") {
      params.set("condition", selections.condition === "nuevo" ? "Nuevo" : "Usado");
    }
    if (selections.usage === "gaming" && !params.get("q")) params.set("tags", "gamer");
    const qs = params.toString();
    return `/catalogo/moreltechnology${qs ? `?${qs}` : ""}`;
  };

  const handleShare = () => {
    const top = recommendations.slice(0, 4);
    const lines = top
      .map((r, i) => `${i + 1}. ${r.product.name} — RD$ ${r.product.price.toLocaleString("es-DO")} — ${SITE_URL}${productUrl(r.product.slug)}`)
      .join("\n");
    const usageLabel = usageOpt?.label || "";
    const budgetLabel = budgetOpt?.label || "";
    const brandLabel = selections.brand === "todas" ? "Cualquier marca" : selections.brand;
    const message =
      `Hola Morel Technology 👋\n\n` +
      `Encontré estas laptops con su Asistente (${usageLabel}, ${budgetLabel}, ${brandLabel}):\n\n` +
      lines +
      `\n\n¿Me pueden dar más información?`;
    const chat = branches[0].whatsappNumber;
    window.open(`https://wa.me/${chat}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const progressSteps = stepOrder.filter(s => s !== "results");
  const currentProgress = step !== "results" ? progressSteps.indexOf(step) + 1 : 0;

  return (
    <div className="min-h-screen pt-16 pb-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,5fr)] gap-10 lg:gap-12 items-start">

          {/* Left column */}
          <div className="lg:sticky lg:top-16 lg:pt-4">
            <div className="text-center lg:text-left space-y-3 md:space-y-4">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Asistente Inteligente
              </div>
              <h1 className="text-2xl md:text-5xl font-black tracking-tight">
                {step === "results" ? "Tus Recomendaciones" : "Encuentra tu Laptop Ideal"}
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg">
                {step === "results"
                  ? `Basado en tus necesidades, estos son los ${Math.min(8, recommendations.length)} mejores equipos para ti.`
                  : "Responde 3 preguntas rápidas y nuestro algoritmo hará el resto."}
              </p>
            </div>

            {/* Trust points (desktop) */}
            <div className="mt-8 hidden lg:flex flex-col gap-3">
              <div className="flex items-start gap-3 p-4 bg-background border border-border/50 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Match a tu perfil</h3>
                  <p className="text-xs text-muted-foreground">Ordenamos los equipos según tu uso, presupuesto y marca.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-background border border-border/50 rounded-xl">
                <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">En menos de 1 minuto</h3>
                  <p className="text-xs text-muted-foreground">Solo 3 preguntas rápidas y obtienes resultados al instante.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-background border border-border/50 rounded-xl">
                <MessageCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Soporte humano</h3>
                  <p className="text-xs text-muted-foreground">Confirma tu elección con un asesor real por WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full">

        {/* Progress Indicator */}
        {step !== "results" && (
          <div className="mb-4 md:mb-8 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center justify-between">
              {progressSteps.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all border-2",
                        i < currentProgress - 1
                          ? "bg-primary border-primary text-primary-foreground"
                          : i === currentProgress - 1
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-card border-border text-muted-foreground"
                      )}
                    >
                      {i < currentProgress - 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] md:text-xs font-semibold capitalize hidden sm:block",
                      i <= currentProgress - 1 ? "text-primary" : "text-muted-foreground"
                    )}>
                      {s === "usage" ? "Uso" : s === "budget" ? "Presupuesto" : "Marca"}
                    </span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all",
                      i < currentProgress - 1 ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Card */}
        <div className="bg-card border border-border/50 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[420px] md:min-h-[560px] flex flex-col">

          <AnimatePresence mode="wait">
            {step === "usage" && (
              <motion.div
                key="usage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-5 md:p-8 lg:p-10 space-y-5 md:space-y-8 flex-1"
              >
                <div className="space-y-1.5 md:space-y-2">
                  <h2 className="text-lg md:text-2xl font-bold">1. ¿Para qué necesitas la laptop?</h2>
                  <p className="text-muted-foreground text-sm md:text-base">Selecciona el uso principal que le darás.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {usageOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelections({ ...selections, usage: opt.id })}
                      className={cn(
                        "flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all text-left group",
                        selections.usage === opt.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "p-2 md:p-3 rounded-xl md:rounded-2xl transition-colors shrink-0",
                        selections.usage === opt.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <opt.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm md:text-base">{opt.label}</h3>
                        <p className="text-[11px] md:text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                      {selections.usage === opt.id && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "budget" && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-5 md:p-8 lg:p-10 space-y-5 md:space-y-8 flex-1"
              >
                <div className="space-y-1.5 md:space-y-2">
                  <h2 className="text-lg md:text-2xl font-bold">2. ¿Cuál es tu presupuesto?</h2>
                  <p className="text-muted-foreground text-sm md:text-base">Dinos cuánto planeas invertir aproximadamente (precios en RD$).</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelections({ ...selections, budget: opt.id })}
                      className={cn(
                        "flex items-center gap-4 md:gap-6 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 transition-all text-left group",
                        selections.budget === opt.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                        selections.budget === opt.id ? "border-primary" : "border-muted-foreground"
                      )}>
                        {selections.budget === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-xl font-bold">{opt.label}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "brand" && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-5 md:p-8 lg:p-10 space-y-5 md:space-y-8 flex-1"
              >
                <div className="space-y-1.5 md:space-y-2">
                  <h2 className="text-lg md:text-2xl font-bold">3. ¿Alguna marca de preferencia?</h2>
                  <p className="text-muted-foreground text-sm md:text-base">Si no tienes preferencia, selecciona &ldquo;Cualquiera&rdquo;.</p>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-16 md:h-24 rounded-2xl md:rounded-3xl border-2 border-border/50 bg-muted/40 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                    <button
                      onClick={() => setSelections({ ...selections, brand: "todas" })}
                      className={cn(
                        "p-3 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all text-center font-bold text-sm md:text-base",
                        selections.brand === "todas"
                          ? "border-primary bg-primary/5 text-primary shadow-lg"
                          : "border-border/50 hover:border-primary/30"
                      )}
                    >
                      Cualquiera
                    </button>
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelections({ ...selections, brand: brand })}
                        className={cn(
                          "p-3 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all text-center font-bold uppercase tracking-wider text-sm md:text-base",
                          selections.brand === brand
                            ? "border-primary bg-primary/5 text-primary shadow-lg"
                            : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        {brand}
                      </button>
                    ))}
                    {brands.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center col-span-full py-4">
                        No se pudieron cargar las marcas. Intenta nuevamente.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {step === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 md:p-8 lg:p-10 space-y-6 md:space-y-8 flex-1"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 pb-6 md:pb-8 border-b">
                  <div className="text-center md:text-left space-y-1">
                    <h2 className="text-xl md:text-3xl font-black">
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Analizando tu perfil…
                        </span>
                      ) : recommendations.length > 0
                        ? `¡Encontramos ${recommendations.length} equipos!`
                        : "No encontramos coincidencias exactas"}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base italic">
                      {recommendations.length > 0
                        ? `Ordenados por compatibilidad con tu perfil.`
                        : "Prueba ajustando el presupuesto o la marca."}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button onClick={handleShare} variant="outline" className="rounded-2xl gap-2 h-10 md:h-12 px-4 text-sm">
                      <Share2 className="w-4 h-4" />
                      Compartir
                    </Button>
                    <Button onClick={reset} variant="ghost" className="rounded-2xl gap-2 h-10 md:h-12 px-4 text-sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-72 rounded-2xl bg-muted/40 animate-pulse" />
                    ))}
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="space-y-5">
                    {/* Perfil editable */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tu perfil:</span>
                      {usageOpt && (
                        <button
                          onClick={() => setStep("usage")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                          {usageOpt.label}
                        </button>
                      )}
                      {budgetOpt && (
                        <button
                          onClick={() => setStep("budget")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                          {budgetOpt.label}
                        </button>
                      )}
                      {selections.brand !== "todas" && (
                        <button
                          onClick={() => setStep("brand")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary transition-colors hover:bg-primary/20"
                        >
                          {selections.brand}
                        </button>
                      )}
                    </div>

                    {/* Controles: condición + sort */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 p-1">
                        {conditionOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelections({ ...selections, condition: opt.value })}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                              selections.condition === opt.value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                        {[
                          { value: "relevance" as ResultSort, label: "Relevancia" },
                          { value: "price_asc" as ResultSort, label: "Precio ↑" },
                          { value: "price_desc" as ResultSort, label: "Precio ↓" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setResultSort(opt.value)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                              resultSort === opt.value
                                ? "bg-card border border-primary/30 text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                      {recommendations.map((rec) => {
                        const monthly = Math.ceil(rec.product.price / FINANCING_MONTHS);
                        const budgetTop = budgetOpt?.range[1];
                        const margin =
                          budgetTop !== undefined && budgetTop !== Infinity
                            ? Math.max(0, budgetTop - rec.product.price)
                            : null;
                        return (
                          <div key={rec.product.id}>
                            <ProductCard product={rec.product} />
                            <div className="mt-2 space-y-1.5 ml-1">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[11px] font-semibold text-primary">{rec.reason}</span>
                              </div>
                              {margin !== null && (
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  <span className="text-[11px] font-medium text-green-600">
                                    RD$ {margin.toLocaleString("es-DO")} bajo tu presupuesto
                                  </span>
                                </div>
                              )}
                              <Link
                                href="/financiamiento"
                                className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:underline"
                              >
                                <CreditCard className="w-3 h-3" />
                                Desde RD$ {monthly.toLocaleString("es-DO")}/mes*
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        {products.length} laptops en stock evaluadas para tu perfil.
                      </div>
                      <Link
                        href={buildCatalogLink()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Ver todos en el catálogo
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 md:py-12 text-center space-y-4 md:space-y-5">
                    <Search className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto opacity-20" />
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold">
                        {nextBudgetCount > 0 ? "No hay equipos en ese rango" : "No encontramos coincidencias exactas"}
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto">
                        {nextBudgetCount > 0
                          ? `Pero encontramos ${nextBudgetCount} equipos que se ajustan a un presupuesto un poco mayor.`
                          : "Intenta ajustar tu presupuesto, condición o seleccionar \"Cualquier marca\"."}
                      </p>
                    </div>

                    {nextBudgetCount > 0 && nextBudgetOpt && (
                      <div className="flex justify-center">
                        <Button
                          onClick={() => setSelections({ ...selections, budget: nextBudgetOpt.id })}
                          className="rounded-2xl h-10 md:h-12 px-6 md:px-8 text-sm md:text-base"
                        >
                          Ver opciones {nextBudgetOpt.label}
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <Button onClick={() => setStep("budget")} variant="outline" className="rounded-2xl h-10 md:h-12 px-6 md:px-8 text-sm md:text-base">
                        <SlidersHorizontal className="w-4 h-4" /> Ajustar presupuesto
                      </Button>
                      <Button onClick={() => setStep("brand")} variant="outline" className="rounded-2xl h-10 md:h-12 px-6 md:px-8 text-sm md:text-base">
                        <SlidersHorizontal className="w-4 h-4" /> Cambiar marca
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          {step !== "results" && (
            <div className="p-4 md:p-8 bg-muted/30 border-t border-border/50 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === "usage"}
                className="rounded-2xl gap-1.5 md:gap-2 h-10 md:h-12 px-4 md:px-6 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={(step === "usage" && !selections.usage) || (step === "budget" && !selections.budget) || isLoading}
                className="rounded-2xl gap-2 md:gap-3 h-11 md:h-14 px-6 md:px-10 text-sm md:text-lg font-bold shadow-xl shadow-primary/20"
              >
                {step === "brand" ? "Ver Recomendaciones" : "Siguiente"}
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Info badges */}
        <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-6 text-[11px] md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            Garantía Local RD
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            Equipos Certificados
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            Soporte por WhatsApp
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          *Cuota estimada a {FINANCING_MONTHS} meses, sujeta a aprobación.{" "}
          <Link href="/financiamiento" className="underline">Ver financiamiento</Link>
        </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecomendadorPage() {
  return (
    <Suspense>
      <RecomendadorPageInner />
    </Suspense>
  );
}