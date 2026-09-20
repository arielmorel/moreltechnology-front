import Link from "next/link";
import Image from "next/image";
import { branches } from "@/lib/data";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-16">
        {/* Logo, Social & Newsletter - Always visible */}
        <div className="space-y-4 mb-6 md:mb-0 md:grid md:grid-cols-4 md:gap-6 md:text-sm md:text-muted-foreground">
          <div className="space-y-3 md:space-y-4">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/logo/moreltechnology.png"
                alt="MorelTechnology Logo"
                width={140}
                height={36}
                className="object-contain h-7 md:h-9 w-auto"
                sizes="140px"
              />
            </Link>
            <p className="text-muted-foreground text-xs md:text-sm max-w-xs hidden md:block">
              Las mejores laptops para estudiar, trabajar y gaming en República Dominicana. Equipos garantizados y de alta calidad.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]" aria-label="Instagram">
                <Instagram size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]" aria-label="Facebook">
                <Facebook size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xs md:text-sm tracking-tight">Newsletter</h3>
              <NewsletterForm />
            </div>
          </div>

          {/* Mobile Accordions */}
          <div className="md:hidden space-y-2">
            <details className="group border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 bg-card hover:bg-muted transition-colors min-h-[44px]">
                <span className="font-semibold text-sm">Enlaces</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <ul className="px-4 pb-3 space-y-2 text-xs text-muted-foreground bg-card">
                <li><Link href="/catalogo/moreltechnology" className="hover:text-foreground transition-colors block py-1.5">Catálogo</Link></li>
                <li><Link href="/servicios" className="hover:text-foreground transition-colors block py-1.5">Servicios</Link></li>
                <li><Link href="/ofertas" className="hover:text-foreground transition-colors block py-1.5">Ofertas</Link></li>
                <li><Link href="/apps" className="hover:text-foreground transition-colors block py-1.5">Apps</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors block py-1.5">Blog</Link></li>
                <li><Link href="/nosotros" className="hover:text-foreground transition-colors block py-1.5">Nosotros</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors block py-1.5">FAQ</Link></li>
              </ul>
            </details>

            <details className="group border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 bg-card hover:bg-muted transition-colors min-h-[44px]">
                <span className="font-semibold text-sm">Categorías</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <ul className="px-4 pb-3 space-y-2 text-xs text-muted-foreground bg-card">
                <li><Link href="/laptops/gaming" className="hover:text-foreground transition-colors block py-1.5">Gaming</Link></li>
                <li><Link href="/laptops/programacion" className="hover:text-foreground transition-colors block py-1.5">Programación</Link></li>
                <li><Link href="/laptops/estudiantes" className="hover:text-foreground transition-colors block py-1.5">Estudiantes</Link></li>
                <li><Link href="/laptops/diseno" className="hover:text-foreground transition-colors block py-1.5">Diseño</Link></li>
                <li><Link href="/laptops/oficina" className="hover:text-foreground transition-colors block py-1.5">Oficina</Link></li>
              </ul>
            </details>

            <details className="group border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 bg-card hover:bg-muted transition-colors min-h-[44px]">
                <span className="font-semibold text-sm">Contacto</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <ul className="px-4 pb-3 space-y-3 text-xs text-muted-foreground bg-card">
                {branches.map(branch => (
                  <li key={branch.id} className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <Link href={`/tienda/${branch.id}`} className="font-medium text-foreground hover:text-foreground transition-colors">
                        {branch.name.replace('Sucursal ', '')}
                      </Link>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {branch.phone}</span>
                    </div>
                  </li>
                ))}
                <li className="flex items-center gap-2 pt-1">
                  <Mail className="h-4 w-4 text-foreground shrink-0" />
                  <span>{branches[0].email}</span>
                </li>
              </ul>
            </details>
          </div>

          {/* Desktop Columns */}
          <div className="hidden md:block space-y-3 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-lg tracking-tight">Enlaces</h2>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li><Link href="/catalogo/moreltechnology" className="hover:text-foreground transition-colors">Catálogo</Link></li>
              <li><Link href="/servicios" className="hover:text-foreground transition-colors">Servicios</Link></li>
              <li><Link href="/ofertas" className="hover:text-foreground transition-colors">Ofertas</Link></li>
              <li><Link href="/apps" className="hover:text-foreground transition-colors">Apps</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/nosotros" className="hover:text-foreground transition-colors">Nosotros</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="hidden md:block space-y-3 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-lg tracking-tight">Categorías</h2>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li><Link href="/laptops/gaming" className="hover:text-foreground transition-colors">Gaming</Link></li>
              <li><Link href="/laptops/programacion" className="hover:text-foreground transition-colors">Programación</Link></li>
              <li><Link href="/laptops/estudiantes" className="hover:text-foreground transition-colors">Estudiantes</Link></li>
              <li><Link href="/laptops/diseno" className="hover:text-foreground transition-colors">Diseño</Link></li>
              <li><Link href="/laptops/oficina" className="hover:text-foreground transition-colors">Oficina</Link></li>
            </ul>
          </div>

          <div className="hidden md:block space-y-3 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-lg tracking-tight">Contacto</h2>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-muted-foreground">
              {branches.map(branch => (
                <li key={branch.id} className="flex items-start gap-2 md:gap-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-foreground shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 md:gap-1">
                    <Link href={`/tienda/${branch.id}`} className="font-medium text-foreground hover:text-foreground transition-colors">
                      {branch.name.replace('Sucursal ', '')}
                    </Link>
                    <span className="hidden md:block">{branch.address.split(',')[0]}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {branch.phone}</span>
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-2 md:gap-3 pt-1 md:pt-2">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-foreground shrink-0" />
                <span>{branches[0].email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 md:mt-12 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MorelTechnology.</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href="/politicas" className="hover:text-foreground transition-colors">Políticas</Link>
            <Link href="/politicas/envios" className="hover:text-foreground transition-colors">Envíos</Link>
            <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
