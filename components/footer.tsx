import Link from "next/link";
import Image from "next/image";
import { branches } from "@/lib/data";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-slate-600">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-3 md:space-y-4">
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
            <p className="text-slate-500 text-xs md:text-sm max-w-xs hidden md:block">
              Las mejores laptops para estudiar, trabajar y gaming en República Dominicana. Equipos garantizados y de alta calidad.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-slate-900" aria-label="Instagram">
                <Instagram size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-slate-900" aria-label="Facebook">
                <Facebook size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xs md:text-sm tracking-tight">Newsletter</h3>
              <NewsletterForm />
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-lg tracking-tight">Enlaces</h2>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-500">
              <li>
                <Link href="/catalogo/moreltechnology" className="hover:text-slate-900 transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="hover:text-slate-900 transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/apps" className="hover:text-slate-900 transition-colors">
                  Apps
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-slate-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-slate-900 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-lg tracking-tight">Categorías</h2>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-500">
              <li>
                <Link href="/laptops/gaming" className="hover:text-slate-900 transition-colors">
                  Gaming
                </Link>
              </li>
              <li>
                <Link href="/laptops/programacion" className="hover:text-slate-900 transition-colors">
                  Programación
                </Link>
              </li>
              <li>
                <Link href="/laptops/estudiantes" className="hover:text-slate-900 transition-colors">
                  Estudiantes
                </Link>
              </li>
              <li>
                <Link href="/laptops/diseno" className="hover:text-slate-900 transition-colors">
                  Diseño
                </Link>
              </li>
              <li>
                <Link href="/laptops/oficina" className="hover:text-slate-900 transition-colors">
                  Oficina
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block space-y-3 md:space-y-4">
            <h2 className="font-semibold text-sm md:text-lg tracking-tight">Contacto</h2>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-slate-500">
              {branches.map(branch => (
                <li key={branch.id} className="flex items-start gap-2 md:gap-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-slate-900 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 md:gap-1">
                    <Link
                      href={`/tienda/${branch.id}`}
                      className="font-medium text-slate-900 hover:text-slate-700 transition-colors"
                    >
                      {branch.name.replace('Sucursal ', '')}
                    </Link>
                    <span className="hidden md:block">{branch.address.split(',')[0]}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {branch.phone}</span>
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-2 md:gap-3 pt-1 md:pt-2">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-slate-900 shrink-0" />
                <span>{branches[0].email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 md:mt-12 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MorelTechnology.</p>
          <div className="flex gap-3 md:gap-4">
            <Link href="/politicas" className="hover:text-slate-900 transition-colors">
              Políticas
            </Link>
            <Link href="/politicas/envios" className="hover:text-slate-900 transition-colors">
              Envíos
            </Link>
            <Link href="/privacidad" className="hover:text-slate-900 transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-slate-900 transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
