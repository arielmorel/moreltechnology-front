import Link from "next/link";
import { ArrowRight, Laptop } from "lucide-react";

const linkClass = "font-semibold text-primary hover:underline underline-offset-2";

const quickLinks = [
  { href: "/laptops/estudiantes", label: "Laptops para estudiantes" },
  { href: "/laptops/oficina", label: "Laptops para trabajo" },
  { href: "/laptops/programacion", label: "Laptops para programar" },
  { href: "/laptops/gaming", label: "Laptops gaming" },
  { href: "/laptops/diseno", label: "Laptops para diseño" },
  { href: "/ofertas", label: "Laptops en oferta" },
];

/**
 * Server-rendered intro copy for the home page: tells Google (and visitors) what the
 * store sells and where, and links the main money page (/laptops) and the landings
 * with descriptive anchors.
 */
export function HomeSeoIntro() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Laptop className="w-4 h-4" />
            Tienda de laptops en RD
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
            Comprar laptop en República Dominicana
          </h2>

          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              En Morel Technology vendemos{" "}
              <Link href="/laptops" className={linkClass}>laptops nuevas y usadas certificadas</Link>{" "}
              de marcas como{" "}
              <Link href="/laptops/lenovo" className={linkClass}>Lenovo</Link>,{" "}
              <Link href="/laptops/dell" className={linkClass}>Dell</Link>,{" "}
              <Link href="/laptops/hp" className={linkClass}>HP</Link> y{" "}
              <Link href="/laptops/apple" className={linkClass}>Apple</Link>. Cada equipo es probado por
              nuestros técnicos antes de la venta e incluye garantía por escrito y factura.
            </p>
            <p>
              Tenemos tiendas físicas en{" "}
              <Link href="/tienda/moreltechnology" className={linkClass}>Santo Domingo</Link> y{" "}
              <Link href="/tienda/mts" className={linkClass}>Santiago</Link>, y hacemos{" "}
              <Link href="/envios" className={linkClass}>envíos a todo el país</Link>. Puedes pagar con tarjeta,
              transferencia o efectivo, o comprar con{" "}
              <Link href="/financiamiento" className={linkClass}>financiamiento</Link>.
            </p>
            <p>
              ¿No sabes cuál elegir? Usa nuestro{" "}
              <Link href="/recomendador" className={linkClass}>recomendador de laptops</Link> o escríbenos
              por WhatsApp y te ayudamos según tu uso y presupuesto.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/laptops"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Ver todas las laptops en RD
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
