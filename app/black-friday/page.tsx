import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Flame,
  Laptop,
  ShieldCheck,
  Sparkles,
  Trophy,
  Truck,
} from "lucide-react";
import { getAllOfferProducts } from "@/lib/api";
import {
  BLACK_FRIDAY_CAMPAIGN,
  getBlackFridayDeals,
  getBlackFridayState,
  getBlackFridayTargetIso,
} from "@/lib/black-friday";
import { LAPTOP_USES } from "@/lib/laptops";
import { isMinioImage, productUrl } from "@/lib/utils";
import { productImageUrl } from "@/lib/product-images";
import { BlackFridayDeals } from "@/components/black-friday/black-friday-deals";
import { BlackFridayCountdown } from "@/components/black-friday/black-friday-countdown";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE_URL = "https://moreltechnologyrd.com";

const faqs = [
  {
    q: "¿Cuándo es el Black Friday 2026 en República Dominicana?",
    a: "Nuestro Black Friday 2026 estará vigente del 1 al 27 de noviembre de 2026, hora de República Dominicana. Durante esas fechas publicaremos laptops seleccionadas con precio de oferta real.",
  },
  {
    q: "¿Qué laptops estarán en oferta?",
    a: "Mostramos únicamente laptops con un precio de oferta válido y menor que su precio regular. El catálogo se actualiza con la información disponible de inventario, por lo que las opciones pueden variar durante la campaña.",
  },
  {
    q: "¿Los precios de Black Friday incluyen garantía?",
    a: "Sí. Todas las laptops incluyen garantía local por escrito. Las nuevas tienen hasta 1 año y las usadas certificadas cuentan con garantía según su condición.",
  },
  {
    q: "¿Puedo financiar una laptop durante el Black Friday?",
    a: "Sí. Puedes financiar tu compra con las entidades disponibles. Solo necesitas tu cédula y comprobante de ingresos. Un asesor te explica las opciones por WhatsApp.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. Realizamos envíos a todas las provincias de República Dominicana y también contamos con delivery en Santo Domingo y Santiago.",
  },
];

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: BLACK_FRIDAY_CAMPAIGN.title,
  description:
    "Descubre laptops en oferta para Black Friday 2026 en República Dominicana. Precios especiales, garantía local, financiamiento y envío a todo el país.",
  keywords: [
    "black friday 2026 republica dominicana",
    "black friday laptops RD",
    "laptops en oferta republica dominicana",
    "ofertas black friday santo domingo",
    "laptops baratas black friday",
    "comprar laptop black friday RD",
  ],
  alternates: {
    canonical: BLACK_FRIDAY_CAMPAIGN.slug,
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: `${SITE_URL}${BLACK_FRIDAY_CAMPAIGN.slug}`,
    title: BLACK_FRIDAY_CAMPAIGN.title,
    description:
      "Laptops en oferta para Black Friday 2026 en República Dominicana. Garantía local, financiamiento y envío a todo el país.",
    siteName: "Morel Technology",
    // og:image comes from ./opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: BLACK_FRIDAY_CAMPAIGN.title,
    description:
      "Laptops en oferta para Black Friday 2026 en República Dominicana. Garantía local, financiamiento y envío a todo el país.",
  },
};

export default async function BlackFridayPage() {
  const state = getBlackFridayState();
  const isActive = state === "active";
  const countdownTarget = getBlackFridayTargetIso(state);

  const products = isActive ? await getAllOfferProducts() : [];
  const deals = getBlackFridayDeals(products);
  const topDeal = deals[0];
  const maxPercent = deals.reduce(
    (max, p) => Math.max(max, Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)),
    0
  );
  const maxSavings = deals.reduce((max, p) => Math.max(max, p.originalPrice! - p.price), 0);
  const formatRD = (value: number) => `RD$ ${value.toLocaleString("es-DO")}`;
  const whatsappMessage =
    "Hola, estoy interesado en las ofertas de laptops de Black Friday 2026. ¿Qué modelos tienen disponibles?";

  const itemListSchema = deals.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: BLACK_FRIDAY_CAMPAIGN.h1,
        numberOfItems: deals.length,
        itemListElement: deals.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            image: productImageUrl(product.slug, product.images[0]),
            description: product.description,
            brand: { "@type": "Brand", name: product.brand },
            sku: product.sku || product.id,
            offers: {
              "@type": "Offer",
              priceCurrency: product.prices[0]?.currency || "DOP",
              price: product.price,
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}${productUrl(product.slug)}`,
            },
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Black Friday 2026",
        item: `${SITE_URL}${BLACK_FRIDAY_CAMPAIGN.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 pb-4 pt-20">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Ruta de navegación">
            <Link href="/" className="transition-colors hover:text-primary">Inicio</Link>
            <span>/</span>
            <span className="font-medium text-foreground">Black Friday 2026</span>
          </nav>
        </div>
      </div>

      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-red-600/25 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-[110px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />

        <div className="container relative mx-auto px-4 pb-20 pt-16 md:px-6 md:pb-32 md:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                <Flame className="h-4 w-4" />
                Black Friday 2026
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Ofertas <span className="text-red-400">Black Friday 2026</span> en Laptops
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                Del 1 al 27 de noviembre de 2026, encuentra laptops nuevas y usadas certificadas
                con precio de oferta real en República Dominicana. Equipos con garantía local,
                financiamiento y envío a todo el país.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {isActive ? (
                  <a
                    href="#ofertas"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-500 px-6 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600"
                  >
                    Ver laptops en oferta
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href="/laptops"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-500 px-6 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600"
                  >
                    Ver laptops disponibles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <WhatsAppDropdown
                  message={whatsappMessage}
                  className="h-12 rounded-xl px-6 text-sm font-bold"
                >
                  Consultar por WhatsApp
                </WhatsAppDropdown>
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-3 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4">
                {[
                  { label: "Vigencia", value: "1 - 27 nov 2026" },
                  {
                    label: "Disponibles",
                    value: isActive ? `${deals.length} ofertas` : "Muy pronto",
                  },
                  {
                    label: "Descuentos",
                    value: isActive && maxPercent > 0 ? `Hasta -${maxPercent}%` : "Reales",
                    accent: isActive && maxPercent > 0,
                  },
                  {
                    label: isActive && maxSavings > 0 ? "Ahorra hasta" : "Cobertura",
                    value: isActive && maxSavings > 0 ? formatRD(maxSavings) : "Envío nacional",
                    accent: isActive && maxSavings > 0,
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                      {stat.label}
                    </dt>
                    <dd
                      className={
                        stat.accent
                          ? "mt-1 text-base font-black text-red-300"
                          : "mt-1 text-sm font-bold"
                      }
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-md md:p-7">
              {state === "ended" ? (
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-red-300">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Campaña finalizada</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    El Black Friday 2026 terminó. Todavía puedes encontrar ofertas disponibles
                    en nuestro catálogo.
                  </p>
                  <Link
                    href="/ofertas"
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-zinc-950 transition-colors hover:bg-red-50"
                  >
                    Ver ofertas disponibles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                        {state === "active" ? "La campaña termina en" : "La campaña comienza en"}
                      </p>
                      <p className="mt-1 text-lg font-black tracking-tight">
                        {state === "active" ? "27 de noviembre" : "1 de noviembre"}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  </div>

                  {countdownTarget && (
                    <BlackFridayCountdown
                      targetIso={countdownTarget}
                      label={state === "active" ? "Termina en" : "Comienza en"}
                    />
                  )}

                  <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/55">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
                      Solo laptops con oferta válida y disponibilidad en catálogo.
                    </p>
                    <p className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                      Garantía local por escrito en todos los equipos.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {isActive && topDeal && (
        <section className="relative -mt-8 pb-4 md:-mt-12">
          <div className="container mx-auto px-4 md:px-6">
            <Link
              href={productUrl(topDeal.slug)}
              className="group grid overflow-hidden rounded-[2rem] border border-red-500/20 bg-card shadow-2xl shadow-red-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/50 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <div className="relative h-60 bg-muted md:h-full md:min-h-[320px]">
                <Image
                  src={topDeal.images[0]}
                  alt={topDeal.name}
                  fill
                  priority
                  unoptimized={isMinioImage(topDeal.images[0])}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                  <Trophy className="h-3.5 w-3.5" />
                  Oferta estrella
                </span>
              </div>

              <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                    {topDeal.brand} · {topDeal.condition}
                  </p>
                  <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight md:text-3xl">
                    {topDeal.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[topDeal.processor, topDeal.ram, topDeal.ssd]
                      .filter((spec) => spec && spec !== "N/A" && spec !== "Consultar")
                      .map((spec) => (
                        <span
                          key={spec}
                          className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground"
                        >
                          {spec}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatRD(topDeal.originalPrice!)}
                    </p>
                    <p className="text-4xl font-black tracking-tight text-emerald-600 md:text-5xl">
                      {formatRD(topDeal.price)}
                    </p>
                  </div>
                  <span className="mb-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-sm font-black text-red-600">
                    Ahorras {formatRD(topDeal.originalPrice! - topDeal.price)}
                  </span>
                </div>

                <span className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-bold text-white transition-colors group-hover:bg-red-500 dark:bg-white dark:text-zinc-950 dark:group-hover:bg-red-500 dark:group-hover:text-white">
                  Ver oferta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {isActive ? (
        <section id="ofertas" className="scroll-mt-24 py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-600">
                <BadgePercent className="h-4 w-4" />
                {deals.length > 0 ? `${deals.length} ofertas activas` : "Ofertas activas"}
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Todas las ofertas de Black Friday
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Precios regulares tachados, precio de oferta y ahorro real en pesos dominicanos.
                Filtra por tipo de equipo u ordena por mayor ahorro. Sujeto a disponibilidad de
                inventario.
              </p>
            </div>

            {deals.length > 0 ? (
              <BlackFridayDeals deals={deals} />
            ) : (
              <div className="rounded-[2rem] border border-border/60 bg-card px-6 py-16 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                  <BadgePercent className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Estamos actualizando las ofertas</h2>
                <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                  En este momento no hay laptops con oferta válida en el catálogo. Escríbenos por
                  WhatsApp y te avisamos cuando estén disponibles.
                </p>
                <WhatsAppDropdown
                  message={whatsappMessage}
                  className="mt-6 h-11 rounded-xl px-5 text-sm font-bold"
                >
                  Consultar disponibilidad
                </WhatsAppDropdown>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-border/60 bg-card px-6 py-12 text-center shadow-sm md:px-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                <CalendarDays className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                {state === "upcoming"
                  ? "Las ofertas comienzan el 1 de noviembre"
                  : "La campaña de Black Friday finalizó"}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                {state === "upcoming"
                  ? "Estamos preparando una selección de laptops con precios especiales para Black Friday 2026. Mientras tanto, puedes explorar el catálogo disponible."
                  : "Gracias por participar en Black Friday 2026. Explora las ofertas vigentes y el catálogo de laptops disponibles."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href={state === "upcoming" ? "/laptops" : "/ofertas"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {state === "upcoming" ? "Ver laptops disponibles" : "Ver ofertas disponibles"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <WhatsAppDropdown
                  message={whatsappMessage}
                  className="h-12 rounded-xl px-6 text-sm font-bold"
                >
                  Consultar por WhatsApp
                </WhatsAppDropdown>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-border/50 bg-muted/25 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Laptop className="h-4 w-4" />
                Laptops en República Dominicana
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Black Friday de laptops en Santo Domingo y todo el país
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  En Morel Technology reunimos laptops para estudiantes, profesionales, gamers y
                  creadores de contenido. Durante Black Friday 2026 mostramos equipos con precio
                  de oferta real, sin descuentos artificiales ni precios inflados.
                </p>
                <p>
                  Cada laptop disponible en esta landing proviene directamente de nuestro catálogo.
                  Puedes comparar el precio regular, el precio de oferta y el ahorro en RD$ antes
                  de elegir. También te acompañamos por WhatsApp si necesitas ayuda para escoger
                  según tu presupuesto, carrera o tipo de trabajo.
                </p>
                <p>
                  Atendemos Santo Domingo, Santiago y el resto de República Dominicana con envío
                  nacional, garantía local y opciones de financiamiento.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {LAPTOP_USES.map((use) => (
                <Link
                  key={use.id}
                  href={use.href}
                  className="group rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40 hover:shadow-lg"
                >
                  <h3 className="font-bold tracking-tight group-hover:text-red-600">
                    {use.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {use.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    Ver opciones
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BadgePercent,
                title: "Ofertas reales",
                text: "Solo mostramos productos cuyo precio de oferta es menor que el precio regular.",
              },
              {
                icon: ShieldCheck,
                title: "Garantía local",
                text: "Equipos nuevos y usados certificados con garantía por escrito.",
              },
              {
                icon: CreditCard,
                title: "Financiamiento",
                text: "Consulta las opciones disponibles con cédula y comprobante de ingresos.",
              },
              {
                icon: Truck,
                title: "Envío nacional",
                text: "Entrega en Santo Domingo, Santiago y todas las provincias del país.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold tracking-tight">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" />
              Preguntas frecuentes
            </div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Dudas sobre el Black Friday 2026
            </h2>
          </div>
          <Accordion className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.q}
                value={`black-friday-faq-${index}`}
                className="overflow-hidden rounded-2xl border border-border/50 bg-card px-6"
              >
                <AccordionTrigger className="py-6 text-left font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary py-16 text-center text-primary-foreground md:py-20">
        <div className="container mx-auto max-w-2xl space-y-5 px-4 md:px-6">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            ¿Buscas una laptop en oferta?
          </h2>
          <p className="text-primary-foreground/80">
            Cuéntanos qué necesitas y un asesor te ayuda a encontrar la mejor opción dentro de
            Black Friday 2026.
          </p>
          <WhatsAppDropdown
            message={whatsappMessage}
            className="h-14 rounded-2xl bg-card px-8 text-lg font-bold text-primary shadow-xl hover:bg-card/90"
          >
            Hablar con un asesor
          </WhatsAppDropdown>
        </div>
      </section>

      {itemListSchema && (
        <script
          id="black-friday-itemlist-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        id="black-friday-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="black-friday-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
