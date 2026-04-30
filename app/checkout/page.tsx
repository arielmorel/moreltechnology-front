"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/store";
import { bankAccounts, branches } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CreditCard,
  Banknote,
  Truck,
  MapPin,
  CheckCircle2,
  Copy,
  ArrowRight,
  ChevronLeft,
  Building2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { WhatsApp } from "@/components/icons";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    delivery: "pickup",
    branch: "santo_domingo",
    address: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleFinalize = () => {
    const newOrderId = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newOrderId);
    setStep("success");
    // In a real app, we would send this to a DB here
  };

  const sendWhatsApp = () => {
    const message = `Hola Morel Technology! 👋\n\nAcabo de realizar un pedido en la web.\n\n*Orden:* ${orderId}\n*Cliente:* ${formData.name}\n*Total:* RD$ ${totalPrice().toLocaleString()}\n*Método:* Transferencia Bancaria\n\nAquí adjunto mi comprobante de pago.`;
    window.open(`https://wa.me/18096175517?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
          <p className="text-muted-foreground">Agrega algunos productos para continuar con el pago.</p>
          <Button
            render={<Link href="/catalogo" />}
            className="rounded-2xl px-8 h-12"
          >
            Ir al Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="flex items-center gap-4 mb-8">
          {step !== "success" && (
            <Button variant="ghost" size="icon" onClick={() => step === "payment" ? setStep("info") : null} disabled={step === "info"}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-3xl font-black">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {step === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="rounded-[2rem] border-border/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                        Información de Contacto
                      </CardTitle>
                      <CardDescription>Dinos quién recibe el pedido</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre Completo</Label>
                          <Input
                            id="name"
                            placeholder="Ej: Juan Pérez"
                            className="rounded-xl h-12"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">WhatsApp / Teléfono</Label>
                          <Input
                            id="phone"
                            placeholder="Ej: 809-000-0000"
                            className="rounded-xl h-12"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico (Opcional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="juan@ejemplo.com"
                          className="rounded-xl h-12"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-border/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Truck className="w-6 h-6 text-primary" />
                        Método de Entrega
                      </CardTitle>
                      <CardDescription>¿Cómo quieres recibir tus equipos?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup
                        value={formData.delivery}
                        onValueChange={(val) => setFormData({ ...formData, delivery: val })}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                          <Label
                            htmlFor="pickup"
                            className="flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                          >
                            <MapPin className="mb-3 h-6 w-6 text-primary" />
                            <span className="font-bold">Recoger en Tienda</span>
                            <span className="text-[10px] text-muted-foreground uppercase mt-1">Gratis</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="shipping" id="shipping" className="peer sr-only" />
                          <Label
                            htmlFor="shipping"
                            className="flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                          >
                            <Truck className="mb-3 h-6 w-6 text-primary" />
                            <span className="font-bold">Envío a Domicilio</span>
                            <span className="text-[10px] text-muted-foreground uppercase mt-1">Desde RD$ 300</span>
                          </Label>
                        </div>
                      </RadioGroup>

                      {formData.delivery === "pickup" ? (
                        <div className="space-y-4 pt-4">
                          <Label>Selecciona una sucursal</Label>
                          <RadioGroup
                            value={formData.branch}
                            onValueChange={(val) => setFormData({ ...formData, branch: val })}
                            className="grid grid-cols-1 gap-3"
                          >
                            {branches.map(branch => (
                              <div key={branch.id}>
                                <RadioGroupItem value={branch.id} id={branch.id} className="peer sr-only" />
                                <Label
                                  htmlFor={branch.id}
                                  className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:border-primary cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{branch.name}</p>
                                    <p className="text-xs text-muted-foreground">{branch.address}</p>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Dirección Completa (Ciudad, Sector, Calle, #)</Label>
                            <Input
                              id="address"
                              placeholder="Ej: Santiago, Los Jardines, Calle 2 #15"
                              className="rounded-xl h-12"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <strong>Nota:</strong> Los envíos al interior se realizan vía Metro Pac o Caribe Pack con cobro en destino. En Santo Domingo tenemos mensajería privada.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-2"
                    onClick={() => {
                      if (!formData.name || !formData.phone) {
                        toast.error("Por favor completa tu nombre y teléfono");
                        return;
                      }
                      setStep("payment");
                    }}
                  >
                    Continuar al Pago
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <Banknote className="w-6 h-6 text-primary" />
                        Método de Pago
                      </CardTitle>
                      <CardDescription>Selecciona cómo deseas pagar</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-primary bg-primary/5">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary text-primary-foreground rounded-xl">
                              <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold">Transferencia Bancaria</p>
                              <p className="text-xs text-muted-foreground">Pago manual verificado vía WhatsApp</p>
                            </div>
                          </div>
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/20 opacity-60">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-muted rounded-xl">
                              <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold">Tarjeta de Crédito / Débito</p>
                              <p className="text-[10px] font-black uppercase text-primary animate-pulse">Próximamente</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4">
                          <h4 className="font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            ¿Cómo funciona?
                          </h4>
                          <ol className="text-sm space-y-3 text-muted-foreground">
                            <li className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">1</span>
                              Realiza la transferencia a cualquiera de nuestras cuentas.
                            </li>
                            <li className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">2</span>
                              Finaliza el pedido aquí para generar tu número de orden.
                            </li>
                            <li className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">3</span>
                              Envíanos el comprobante por WhatsApp indicando tu número de orden.
                            </li>
                          </ol>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-8 border-t border-border/50">
                        <h4 className="font-bold mb-6">Nuestras Cuentas Bancarias</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {bankAccounts.map((acc, idx) => (
                            <div key={idx} className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3 group hover:border-primary/30 transition-colors">
                              <div className="flex justify-between items-start">
                                <span className="font-black text-xs uppercase tracking-widest text-primary">{acc.bank}</span>
                                <Badge variant="outline" className="text-[10px]">{acc.currency}</Badge>
                              </div>
                              <div className="flex justify-between items-center group/btn">
                                <span className="font-mono text-lg font-bold">{acc.accountNumber}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={() => handleCopy(acc.accountNumber, "Número de cuenta")}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                <p>{acc.holder}</p>
                                <p>{acc.accountType}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-2"
                    onClick={handleFinalize}
                  >
                    Confirmar Pedido
                    <CheckCircle2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 py-12 text-center"
                >
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black italic tracking-tighter">¡PEDIDO RECIBIDO!</h2>
                    <p className="text-muted-foreground text-lg">Tu orden <span className="font-bold text-foreground">#{orderId}</span> ha sido generada correctamente.</p>
                  </div>

                  <div className="max-w-md mx-auto p-8 bg-card border-2 border-dashed border-primary/20 rounded-[2.5rem] space-y-6">
                    <p className="font-medium">Para procesar tu envío, por favor envíanos el comprobante de transferencia:</p>
                    <Button
                      className="w-full h-16 rounded-2xl text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20 gap-3"
                      onClick={sendWhatsApp}
                    >
                      <WhatsApp size={24} />
                      Enviar Comprobante
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground pt-10">
                    ¿Tienes dudas? <Link href="/contacto" className="text-primary font-bold">Contáctanos aquí</Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Order Summary */}
          {step !== "success" && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{item.name}</p>
                            <p className="text-muted-foreground text-xs">{item.quantity} x RD$ {item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">RD$ {totalPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="font-medium">{formData.delivery === "pickup" ? "Gratis" : "RD$ 300+"}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-end">
                        <span className="font-bold">Total del Pedido</span>
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">RD$ {totalPrice().toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 bg-muted/50 rounded-3xl border border-border/50 text-xs text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2 font-bold text-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Compra 100% Segura
                  </p>
                  <p>Tus datos están protegidos. El pago se verifica manualmente por nuestro equipo para tu seguridad.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
