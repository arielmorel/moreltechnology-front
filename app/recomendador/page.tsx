"use client";

import { useEffect, useState, useMemo } from "react";
import { categories, Product } from "@/lib/data";
import { getProducts, PAGE_SIZE_ALL } from "@/lib/api";
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
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Step = "usage" | "budget" | "brand" | "results";

const US_TO_DOP = 60;

const usageOptions = [
  { id: "gaming", label: "Gaming", icon: Gamepad2, desc: "Juegos de alta gama y streaming", category: "gaming" },
  { id: "oficina", label: "Oficina", icon: Briefcase, desc: "Multitarea, Excel y videollamadas", category: "oficina" },
  { id: "estudio", label: "Estudio", icon: GraduationCap, desc: "Tareas, investigación y portabilidad", category: "estudiantes" },
  { id: "edicion", label: "Edición / Diseño", icon: Video, desc: "Adobe, Renderizado 3D y 4K", category: "diseno" },
];

const budgetOptions = [
  { id: "low", label: "RD$ 20k - 40k", range: [0, 40000 / US_TO_DOP], desc: "Económico y funcional" },
  { id: "mid", label: "RD$ 40k - 60k", range: [40000 / US_TO_DOP, 60000 / US_TO_DOP], desc: "Equilibrio potencia/precio" },
  { id: "high", label: "RD$ 60k+", range: [60000 / US_TO_DOP, 99999], desc: "Rendimiento profesional" },
];

export default function RecomendadorPage() {
  const [step, setStep] = useState<Step>("usage");
  const [selections, setSelections] = useState({
    usage: "",
    budget: "",
    brand: "todas",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const { products: fetchedProducts } = await getProducts(0, PAGE_SIZE_ALL);
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map(p => p.brand));
    return Array.from(uniqueBrands);
  }, [products]);

  const recommendations = useMemo(() => {
    if (step !== "results") return [];

    const usageOpt = usageOptions.find(o => o.id === selections.usage);
    const budgetOpt = budgetOptions.find(o => o.id === selections.budget);

    return products.filter(product => {
      const name = product.name.toLowerCase();
      const desc = product.description.toLowerCase();
      
      // Filter by usage (using keywords for the real catalog)
      let matchesUsage = true;
      if (selections.usage === "gaming") {
        matchesUsage = desc.includes("gaming") || desc.includes("gamer") || desc.includes("nvidia") || desc.includes("radeon") || name.includes("zbook");
      } else if (selections.usage === "edicion") {
        matchesUsage = product.brand === "Apple" || product.ram.includes("16GB") || product.ram.includes("32GB") || desc.includes("i7") || desc.includes("i9");
      } else if (selections.usage === "oficina") {
        matchesUsage = product.category === "laptop" || product.category === "oficina";
      }
      
      // Filter by budget
      const matchesBudget = !budgetOpt || (product.price >= budgetOpt.range[0] && product.price <= budgetOpt.range[1]);
      
      // Filter by brand
      const matchesBrand = selections.brand === "todas" || product.brand === selections.brand;

      return matchesUsage && matchesBudget && matchesBrand;
    }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 6);
  }, [products, step, selections]);

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
    setSelections({ usage: "", budget: "", brand: "todas" });
    setStep("usage");
  };

  return (
    <div className="min-h-screen pt-16 pb-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Progress Header */}
        <div className="mb-6 md:mb-12 text-center space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Asistente Inteligente
          </div>
          <h1 className="text-2xl md:text-5xl font-black tracking-tight">
            {step === "results" ? "Tus Recomendaciones" : "Encuentra tu Laptop Ideal"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">
            {step === "results" 
              ? "Basado en tus necesidades, estos son los mejores equipos para ti." 
              : "Responde 3 preguntas rápidas y nuestro algoritmo hará el resto."}
          </p>
        </div>

        {/* Wizard Card */}
        <div className="bg-card border border-border/50 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[400px] md:min-h-[500px] flex flex-col">
          
          <AnimatePresence mode="wait">
            {step === "usage" && (
              <motion.div 
                key="usage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-5 md:p-12 space-y-5 md:space-y-8 flex-1"
              >
                <div className="space-y-1.5 md:space-y-2">
                  <h2 className="text-lg md:text-2xl font-bold">1. ¿Para qué necesitas la laptop?</h2>
                  <p className="text-muted-foreground text-sm md:text-base">Selecciona el uso principal que le darás.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                className="p-5 md:p-12 space-y-5 md:space-y-8 flex-1"
              >
                <div className="space-y-1.5 md:space-y-2">
                  <h2 className="text-lg md:text-2xl font-bold">2. ¿Cuál es tu presupuesto?</h2>
                  <p className="text-muted-foreground text-sm md:text-base">Dinos cuánto planeas invertir aproximadamente.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
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
                      <div className="ml-auto text-primary font-black text-[10px] md:text-xs opacity-50 uppercase tracking-widest hidden sm:block">
                        ~ US$ {Math.round(opt.range[0])} - {Math.round(opt.range[1])}
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
                className="p-5 md:p-12 space-y-5 md:space-y-8 flex-1"
              >
                <div className="space-y-1.5 md:space-y-2">
                  <h2 className="text-lg md:text-2xl font-bold">3. ¿Alguna marca de preferencia?</h2>
                  <p className="text-muted-foreground text-sm md:text-base">Si no tienes preferencia, selecciona &ldquo;Cualquiera&rdquo;.</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 md:gap-4">
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
                </div>
              </motion.div>
            )}

            {step === "results" && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 md:p-12 space-y-6 md:space-y-12 flex-1"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 pb-6 md:pb-8 border-b">
                  <div className="text-center md:text-left space-y-1">
                    <h2 className="text-xl md:text-3xl font-black">¡Encontramos {recommendations.length} equipos!</h2>
                    <p className="text-muted-foreground text-sm md:text-base italic">Seleccionados especialmente para tu perfil.</p>
                  </div>
                  <Button onClick={reset} variant="outline" className="rounded-2xl gap-2 h-10 md:h-12 px-4 md:px-6 text-sm">
                    <RotateCcw className="w-4 h-4" />
                    Nueva búsqueda
                  </Button>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    {recommendations.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 md:py-20 text-center space-y-4 md:space-y-6">
                    <Search className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto opacity-20" />
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold">No encontramos coincidencias exactas</h3>
                      <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto">
                        Intenta ajustar tu presupuesto o seleccionar &ldquo;Cualquier marca&rdquo;.
                      </p>
                    </div>
                    <Button onClick={() => setStep("budget")} className="rounded-2xl h-10 md:h-12 px-6 md:px-8 text-sm md:text-base">Ajustar filtros</Button>
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
                disabled={(step === "usage" && !selections.usage) || (step === "budget" && !selections.budget)}
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

      </div>
    </div>
  );
}
