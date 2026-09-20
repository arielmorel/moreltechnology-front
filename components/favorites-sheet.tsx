"use client";

import { useFavorites } from "@/lib/favorites-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { isMinioImage, productUrl } from "@/lib/utils";
import Link from "next/link";
import { WhatsAppDropdown } from "./whatsapp-dropdown";

export function FavoritesSheet() {
  const { items, removeFavorite, clearFavorites } = useFavorites();

  const itemCount = items.length;

  const favoritesMessage = () => {
    const itemsText = items.map(item => `- ${item.name} - RD$ ${item.price.toLocaleString("es-DO")}`).join("\n");
    return `*MIS FAVORITOS EN MOREL TECHNOLOGY* ❤️\n\n${itemsText}\n\n¡Hola! Me interesan estos equipos. ¿Están disponibles?`;
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" className="relative rounded-full border-primary/20 hover:bg-primary/5" aria-label="Ver favoritos" />
        }
      >
        <span key={`fav-icon-${itemCount}`} className="inline-flex animate-bounce">
          <Heart className="h-5 w-5" />
        </span>
        {itemCount > 0 && (
          <span key={`fav-count-${itemCount}`} className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/50 shadow-2xl">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Mis Favoritos
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
              <Heart className="w-16 h-16" />
              <div>
                <p className="text-lg font-bold">Aún no tienes favoritos</p>
                <p className="text-sm">Toca el corazón en cualquier laptop para guardarla aquí.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <Link href={productUrl(item.slug)} className="w-16 h-16 rounded-xl bg-muted border border-border/80 overflow-hidden shrink-0 relative">
                  <Image
                    src={item.images?.[0] || '/images/placeholder-laptop.png'}
                    alt={item.name}
                    fill
                    sizes="64px"
                    unoptimized={isMinioImage(item.images?.[0] || '')}
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={productUrl(item.slug)}
                      className="font-sans text-sm font-semibold text-foreground truncate hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      aria-label="Quitar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-foreground mt-1">RD${item.price.toLocaleString("es-DO")}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t border-border/50 bg-muted/20 flex-col sm:flex-col gap-4">
            <div className="w-full flex flex-col gap-3 pt-2">
              <WhatsAppDropdown
                message={favoritesMessage()}
                variant="outline"
                className="w-full h-12 rounded-xl text-sm font-bold border-green-600/50 text-green-600"
              >
                Cotizar favoritos vía WhatsApp
              </WhatsAppDropdown>

              <div className="flex gap-3">
                <SheetClose
                  render={
                    <Button
                      nativeButton={false}
                      render={<Link href="/catalogo/moreltechnology" className="flex items-center justify-center gap-2 whitespace-nowrap" />}
                      className="w-full h-12 rounded-xl text-sm font-bold"
                    />
                  }
                >
                  Ir al catálogo
                  <ArrowRight className="w-4 h-4" />
                </SheetClose>
                <Button
                  variant="outline"
                  onClick={clearFavorites}
                  className="h-12 shrink-0 rounded-xl text-sm px-3 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground italic">
              *Tus favoritos se guardan en este dispositivo.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}