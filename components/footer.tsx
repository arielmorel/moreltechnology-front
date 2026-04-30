import Link from "next/link";
import Image from "next/image";
import { branches } from "@/lib/data";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/morel_technology_logo.png"
                alt="Morel Technology Logo"
                width={160}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Las mejores laptops para estudiar, trabajar y gaming en República Dominicana. Equipos garantizados y de alta calidad.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Instagram size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Facebook size={18} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg tracking-tight">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/catalogo" className="hover:text-primary transition-colors">
                  Catálogo de Laptops
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="hover:text-primary transition-colors">
                  Ofertas Especiales
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="hover:text-primary transition-colors">
                  Políticas de Garantía
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg tracking-tight">Categorías</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/catalogo?categoria=gaming" className="hover:text-primary transition-colors">
                  Gaming
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=oficina" className="hover:text-primary transition-colors">
                  Oficina & Productividad
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=estudiantes" className="hover:text-primary transition-colors">
                  Estudiantes
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=diseno" className="hover:text-primary transition-colors">
                  Diseño Gráfico
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=apple" className="hover:text-primary transition-colors">
                  MacBooks
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg tracking-tight">Contacto</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {branches.map(branch => (
                <li key={branch.id} className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{branch.name.replace('Sucursal ', '')}</span>
                    <span>{branch.address.split(',')[0]}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {branch.phone}</span>
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-3 pt-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>{branches[0].email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MorelTechnology. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
