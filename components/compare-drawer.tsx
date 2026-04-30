"use client";

import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, ArrowRightLeft, Trash2, Cpu, MemoryStick, HardDrive, ShieldCheck, DollarSign } from "lucide-react";
import Image from "next/image";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function CompareDrawer() {
  const { compareItems, removeFromCompare, clearCompare } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-2xl">
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-3xl p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary hidden md:block">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">Comparador</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground">{compareItems.length} de 3 seleccionados</p>
              </div>
              <div className="flex -space-x-3 ml-2">
                {compareItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-background overflow-hidden bg-muted">
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                    </div>
                    <button 
                      onClick={() => removeFromCompare(item.id)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCompare}
                className="text-muted-foreground hover:text-destructive hidden md:flex"
              >
                Limpiar
              </Button>
              
              <Dialog>
                <DialogTrigger 
                  render={
                    <Button className="flex-1 md:flex-none rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20 gap-2" />
                  }
                >
                  Comparar ahora
                  <ArrowRightLeft className="w-4 h-4" />
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0 border-none shadow-2xl">
                  <DialogHeader className="p-8 border-b bg-muted/30">
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                      <ArrowRightLeft className="w-6 h-6 text-primary" />
                      Comparativa Técnica
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="p-4 md:p-8 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-4 text-left min-w-[150px]"></th>
                          {compareItems.map(item => (
                            <th key={item.id} className="p-4 min-w-[200px]">
                              <div className="flex flex-col items-center gap-4 text-center">
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-muted border border-border/50">
                                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="space-y-1">
                                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{item.brand}</Badge>
                                  <h4 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h4>
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-t border-border/50">
                          <td className="p-4 font-bold text-muted-foreground flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Precio
                          </td>
                          {compareItems.map(item => (
                            <td key={item.id} className="p-4 text-center">
                              <span className="text-xl font-black text-primary">US${item.price.toLocaleString()}</span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-t border-border/50 bg-muted/20">
                          <td className="p-4 font-bold text-muted-foreground flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Procesador
                          </td>
                          {compareItems.map(item => (
                            <td key={item.id} className="p-4 text-center font-semibold">
                              {item.processor}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-t border-border/50">
                          <td className="p-4 font-bold text-muted-foreground flex items-center gap-2">
                            <MemoryStick className="w-4 h-4" /> RAM
                          </td>
                          {compareItems.map(item => (
                            <td key={item.id} className="p-4 text-center">
                              {item.ram}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-t border-border/50 bg-muted/20">
                          <td className="p-4 font-bold text-muted-foreground flex items-center gap-2">
                            <HardDrive className="w-4 h-4" /> Disco
                          </td>
                          {compareItems.map(item => (
                            <td key={item.id} className="p-4 text-center">
                              {item.ssd}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-t border-border/50">
                          <td className="p-4 font-bold text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Estado
                          </td>
                          {compareItems.map(item => (
                            <td key={item.id} className="p-4 text-center">
                              <Badge variant="secondary">{item.condition}</Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-t border-border/50 bg-muted/20">
                          <td className="p-4 font-bold text-muted-foreground"></td>
                          {compareItems.map(item => (
                            <td key={item.id} className="p-4 text-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-xl border-primary/20 hover:bg-primary/5"
                                onClick={() => removeFromCompare(item.id)}
                              >
                                Quitar
                              </Button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
