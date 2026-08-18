"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, Home, ShoppingBag, Sparkles, Tag, CreditCard, Users, Phone, MapPin, BookOpen, Smartphone, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { CartSheet } from "./cart-sheet";

const navLinks = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Catálogo", href: "/catalogo/moreltechnology", icon: ShoppingBag },
  { name: "Ofertas", href: "/ofertas", icon: Tag },
  { name: "Recomendador", href: "/recomendador", icon: Sparkles },
  { name: "Apps", href: "/apps", icon: Smartphone },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Financiamiento", href: "/financiamiento", icon: CreditCard },
  { name: "Nosotros", href: "/nosotros", icon: Users },
  { name: "Contacto", href: "/contacto", icon: Phone },
];

const sucursalLinks = [
  { name: "Santo Domingo", href: "/tienda/moreltechnology", icon: MapPin },
  { name: "Santiago", href: "/tienda/mts", icon: MapPin },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sucursalOpen, setSucursalOpen] = useState(false);
  const sucursalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sucursalRef.current && !sucursalRef.current.contains(e.target as Node)) {
        setSucursalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <Image
              src="/logo/moreltechnology.png"
              alt="MorelTechnology Logo"
              width={120}
              height={32}
              className="object-contain h-7 md:h-8 w-auto"
              sizes="120px"
              priority
            />
          </Link>
          {mounted && (() => {
            const activeLink = navLinks.find(link => link.href !== "/" && pathname.startsWith(link.href));
            if (!activeLink) return null;
            return (
              <span className="md:hidden text-xs font-black uppercase tracking-widest text-primary ml-2 px-2 py-0.5 bg-primary/10 rounded-md">
                {activeLink.name}
              </span>
            );
          })()}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = mounted && pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <link.icon className={cn(
                  "w-3.5 h-3.5",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )} />
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Sucursales Dropdown */}
          <div ref={sucursalRef} className="relative">
            <button
              onClick={() => setSucursalOpen(!sucursalOpen)}
              className={cn(
                "relative text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                mounted && sucursalLinks.some(l => pathname === l.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <MapPin className={cn(
                "w-3.5 h-3.5",
                mounted && sucursalLinks.some(l => pathname === l.href) ? "text-foreground" : "text-muted-foreground"
              )} />
              Sucursales
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                sucursalOpen && "rotate-180"
              )} />
            </button>
            {sucursalOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border/50 rounded-xl shadow-xl py-1 z-50">
                {sucursalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSucursalOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                      mounted && pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <CartSheet />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="Cambiar tema de color"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <CartSheet />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="Cambiar tema de color"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - CSS transitions, no forced reflow */}
      <div
        className={cn(
          "md:hidden border-b bg-background/95 backdrop-blur-md overflow-y-auto transition-[max-height,opacity] duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-base font-semibold px-5 py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center gap-4",
                  mounted && pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "hover:bg-muted text-muted-foreground active:bg-muted/80"
                )}
            >
              <link.icon className={cn("w-5 h-5", mounted && pathname === link.href ? "text-primary-foreground" : "text-primary")} />
              {link.name}
            </Link>
          ))}

          {/* Mobile Sucursales */}
          <div className="px-3 pt-1">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-5">Sucursales</div>
            {sucursalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-base font-semibold px-5 py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center gap-4",
                  mounted && pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "hover:bg-muted text-muted-foreground active:bg-muted/80"
                )}
              >
                <link.icon className={cn("w-5 h-5", mounted && pathname === link.href ? "text-primary-foreground" : "text-primary")} />
                {link.name}
              </Link>
            ))}
          </div>

        </nav>
      </div>
    </header>
  );
}
