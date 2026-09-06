"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, Home, ShoppingBag, Sparkles, CreditCard, Users, Phone, MapPin, BookOpen, ChevronDown, Search, MoreHorizontal } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const CartSheet = dynamic(() => import("./cart-sheet").then(m => m.CartSheet), { ssr: false });
const SearchDialog = dynamic(() => import("./search-dialog").then(m => m.SearchDialog), { ssr: false });

const navLinks = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Catálogo", href: "/catalogo/moreltechnology", icon: ShoppingBag },
  { name: "Asistente IA", href: "/recomendador", icon: Sparkles },
];

const secondaryLinks = [
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sucursalRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

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
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 md:bg-background/80 backdrop-blur-md border-b border-slate-100 md:border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1 md:gap-2">
          {mounted && pathname !== "/" && (
            <button
              onClick={() => window.history.back()}
              className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-slate-600 hover:text-slate-900 transition-colors -ml-1"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link href="/" className="flex items-center transition-transform hover:scale-105 min-h-[44px] min-w-[44px] justify-center -ml-2">
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
              <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-md">
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

          {/* Más Dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "relative text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                mounted && secondaryLinks.some(l => pathname === l.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <MoreHorizontal className={cn(
                "w-3.5 h-3.5",
                mounted && secondaryLinks.some(l => pathname === l.href) ? "text-foreground" : "text-muted-foreground"
              )} />
              Más
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                moreOpen && "rotate-180"
              )} />
            </button>
            {moreOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border/50 rounded-xl shadow-xl py-1 z-50">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
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

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-xs font-medium rounded-lg px-3 py-2 flex items-center justify-between w-56 transition-colors border border-transparent cursor-pointer"
            aria-label="Buscar laptops"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left ml-2">Buscar laptops...</span>
            <kbd className="bg-white border border-slate-300 text-slate-500 rounded px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
          </button>
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

        {/* Mobile Menu - Only Logo, Cart, Hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-11 h-11 min-h-[44px] min-w-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out max-h-[85vh] flex flex-col">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-3 pb-6 flex-1 overscroll-contain">
              {/* Search in mobile menu */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-muted rounded-xl text-muted-foreground text-sm font-medium mb-3"
              >
                <Search className="w-4 h-4" />
                Buscar...
              </button>

              <nav className="flex flex-col gap-0.5">
                {navLinks.map((link) => {
                  const isActive = mounted && pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-sm font-medium px-4 py-3 rounded-xl transition-all active:scale-[0.98] flex items-center gap-3 min-h-[44px]",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 active:bg-muted"
                      )}
                    >
                      <link.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="my-3 mx-3 h-px bg-border" />

              {/* Secondary Links */}
              <div className="px-1 pt-0.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 px-3">Más</div>
                <div className="flex flex-col gap-0.5">
                  {secondaryLinks.map((link) => {
                    const isActive = mounted && pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "text-sm font-medium px-4 py-3 rounded-xl transition-all active:scale-[0.98] flex items-center gap-3 min-h-[44px]",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 active:bg-muted"
                        )}
                      >
                        <link.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 mx-3 h-px bg-border" />

              {/* Sucursales */}
              <div className="px-1 pt-0.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 px-3">Sucursales</div>
                <div className="flex flex-col gap-0.5">
                  {sucursalLinks.map((link) => {
                    const isActive = mounted && pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "text-sm font-medium px-4 py-3 rounded-xl transition-all active:scale-[0.98] flex items-center gap-3 min-h-[44px]",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 active:bg-muted"
                        )}
                      >
                        <link.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 mx-3 h-px bg-border" />

              {/* Dark Mode Toggle in mobile menu */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 active:bg-muted text-sm font-medium min-h-[44px]"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
                  {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
