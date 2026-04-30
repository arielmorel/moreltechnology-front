"use client";

import { useCart } from "@/lib/store";
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
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { WhatsAppDropdown } from "./whatsapp-dropdown";
import { useState, useEffect } from "react";
import Link from "next/link";

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const orderMessage = () => {
    const itemsText = items.map(item => `- ${item.name} (${item.quantity}x) - RD$ ${(item.price * item.quantity).toLocaleString()}`).join("\n");
    return `*NUEVO PEDIDO DESDE LA WEB* 🛒\n\n${itemsText}\n\n*Total:* RD$ ${totalPrice().toLocaleString()}\n\n¡Hola! Me interesa comprar estos equipos. ¿Están disponibles?`;
  };

  return (
    <Sheet>
      <SheetTrigger 
        render={
          <Button variant="outline" size="icon" className="relative rounded-full border-primary/20 hover:bg-primary/5" />
        }
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            {totalItems()}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/50 shadow-2xl">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
              <ShoppingCart className="w-16 h-16" />
              <div>
                <p className="text-lg font-bold">Tu carrito está vacío</p>
                <p className="text-sm">Agrega algunos equipos para cotizar.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-snug">{item.name}</h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-primary font-bold text-sm mt-1">US${item.price.toLocaleString()}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted transition-colors border-r"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted transition-colors border-l"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t border-border/50 bg-muted/20 flex-col sm:flex-col gap-4">
            <div className="space-y-1.5 w-full">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-bold">RD$ {totalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <span className="text-base font-bold">Total del Pedido</span>
                <div className="text-right">
                  <p className="text-xl font-black text-primary leading-none">RD$ {totalPrice().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 pt-2">
              <SheetClose 
                render={
                  <Button 
                    render={<Link href="/checkout" className="flex items-center justify-center gap-2 whitespace-nowrap" />}
                    className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20" 
                  />
                }
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5" />
              </SheetClose>

              <WhatsAppDropdown
                message={orderMessage()}
                variant="outline"
                className="w-full h-12 rounded-xl text-sm font-bold border-green-600/50 text-green-600"
              >
                Pedido Rápido vía WhatsApp
              </WhatsAppDropdown>
            </div>
            <p className="text-[10px] text-center text-muted-foreground italic">
              *El precio final y disponibilidad se confirmarán vía WhatsApp.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
