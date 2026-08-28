"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { WhatsApp } from "@/components/icons";
import { isMinioImage } from "@/lib/utils";
import axios from "axios";

const bankStyles: Record<string, { accent: string; soft: string; text: string; hover: string }> = {
  "Banco Popular": {
    accent: "bg-blue-700",
    soft: "bg-blue-50 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-300",
    hover: "hover:text-blue-800 dark:hover:text-blue-300",
  },
  Banreservas: {
    accent: "bg-blue-800",
    soft: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-blue-800 dark:text-blue-300",
    hover: "hover:text-blue-800 dark:hover:text-blue-300",
  },
  "Banco BHD": {
    accent: "bg-green-600",
    soft: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-300",
    hover: "hover:text-green-700 dark:hover:text-green-300",
  },
};

export default function CheckoutPageWrapper() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}

function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("referralCode", ref);
      setReferralCode(ref);
    } else {
      setReferralCode(localStorage.getItem("referralCode"));
    }
    setMounted(true);
  }, [searchParams]);
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    rnc: "",
    delivery: "pickup",
    branch: "moreltechnology",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [loading, setLoading] = useState(false);

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8282";
  const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN || "smartbusiness-public-web-key-2026";

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const payload = {
        branchId: formData.branch,
        publicId: formData.branch,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || null,
        customerRnc: formData.rnc || null,
        orderType: formData.delivery === "pickup" ? "PICKUP" : "DELIVERY",
        deliveryAddress: formData.delivery === "shipping" ? formData.address : null,
        notes: formData.notes || null,
        referralCode,
        items: items.map((item) => ({
          productId: Number(item.id),
          productName: item.name,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(`${API_BASE}/api/web/orders`, payload, {
        headers: {
          "X-Public-App-Token": APP_TOKEN,
        },
      });

      const data = response.data;
      const newOrderId = data.code || data.orderCode || data.orderId || data.id || `MT-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(String(newOrderId));
      setStep("success");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Hubo un error al procesar tu pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = () => {
    const message = `Hola Morel Technology! 👋\n\nAcabo de realizar un pedido en la web.\n\n*Orden:* ${orderId}\n*Cliente:* ${formData.name}\n*Total:* RD$ ${totalPrice().toLocaleString("es-DO")}\n*Método:* Transferencia Bancaria\n\nAquí adjunto mi comprobante de pago.`;
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
          <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="text-muted-foreground">Agrega algunos productos para continuar con el pago.</p>
          <Button
            nativeButton={false}
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
    <div className="min-h-screen pt-16 pb-16 bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="flex items-center gap-4 mb-8">
          {step !== "success" && (
            <Button variant="ghost" size="icon" onClick={() => step === "payment" ? setStep("info") : null} disabled={step === "info"} aria-label="Volver">
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
                  <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                          <User className="w-5 h-5" />
                        </div>
                        Información de Contacto
                      </CardTitle>
                      <CardDescription>Dinos quién recibe el pedido</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold">
                            Nombre Completo <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="Ej: Juan Pérez"
                              className={`rounded-xl h-12 pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                              value={formData.name}
                              onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                clearError("name");
                              }}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-xs text-destructive font-medium flex items-center gap-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold">
                            WhatsApp / Teléfono <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              placeholder="Ej: 809-000-0000"
                              className={`rounded-xl h-12 pl-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                              value={formData.phone}
                              onChange={(e) => {
                                setFormData({ ...formData, phone: e.target.value });
                                clearError("phone");
                              }}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-xs text-destructive font-medium flex items-center gap-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">
                          Correo Electrónico
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            className="rounded-xl h-12 pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Opcional. Te enviaremos la confirmación de tu pedido.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rnc" className="text-sm font-semibold text-muted-foreground">
                          RNC / Cédula
                        </Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="rnc"
                            placeholder="Ej: 001-12345-67"
                            className="rounded-xl h-12 pl-10"
                            value={formData.rnc}
                            onChange={(e) => setFormData({ ...formData, rnc: e.target.value })}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Opcional. Para factura con RNC.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                          <Truck className="w-5 h-5" />
                        </div>
                        Método de Entrega
                      </CardTitle>
                      <CardDescription>
                        {formData.delivery === "pickup"
                          ? "Recogerás tu pedido en tienda"
                          : "Enviaremos tu pedido a domicilio"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <RadioGroup
                        value={formData.delivery}
                        onValueChange={(val) => setFormData({ ...formData, delivery: val })}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                          <Label
                            htmlFor="pickup"
                            className="relative flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[checked]:border-primary peer-data-[checked]:bg-primary/5 peer-data-[checked]:text-primary [&:has([data-checked])]:border-primary [&:has([data-checked])]:bg-primary/5 [&:has([data-checked])]:text-primary cursor-pointer transition-all"
                          >
                            {formData.delivery === "pickup" && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3">
                              <MapPin className="h-6 w-6 text-emerald-600" />
                            </div>
                            <span className="font-bold">Recoger en Tienda</span>
                            <span className="text-[10px] text-muted-foreground uppercase mt-1">Gratis</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="shipping" id="shipping" className="peer sr-only" />
                          <Label
                            htmlFor="shipping"
                            className="relative flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[checked]:border-primary peer-data-[checked]:bg-primary/5 peer-data-[checked]:text-primary [&:has([data-checked])]:border-primary [&:has([data-checked])]:bg-primary/5 [&:has([data-checked])]:text-primary cursor-pointer transition-all"
                          >
                            {formData.delivery === "shipping" && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3">
                              <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="font-bold">Envío a Domicilio</span>
                            <span className="text-[10px] text-muted-foreground uppercase mt-1">Desde RD$ 300</span>
                          </Label>
                        </div>
                      </RadioGroup>

                      {formData.delivery === "pickup" ? (
                        <div className="space-y-4 pt-4">
                          <Label className="text-sm font-semibold">Selecciona una sucursal</Label>
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
                                  className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-border/50 peer-data-[checked]:bg-primary/5 peer-data-[checked]:border-primary [&:has([data-checked])]:bg-primary/5 [&:has([data-checked])]:border-primary cursor-pointer transition-all"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-muted peer-data-[checked]:bg-primary/10 [&:has([data-checked])]:bg-primary/10 flex items-center justify-center transition-colors">
                                    <Building2 className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-sm">{branch.name}</p>
                                    <p className="text-xs text-muted-foreground">{branch.address}</p>
                                  </div>
                                  <CheckCircle2 className="w-5 h-5 text-primary opacity-0 peer-data-[checked]:opacity-100 [&:has([data-checked])]:opacity-100 transition-opacity" />
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-semibold">
                              Dirección Completa <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="address"
                                placeholder="Ej: Santiago, Los Jardines, Calle 2 #15"
                                className={`rounded-xl h-12 pl-10 ${errors.address ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                                value={formData.address}
                                onChange={(e) => {
                                  setFormData({ ...formData, address: e.target.value });
                                  clearError("address");
                                }}
                              />
                            </div>
                            {errors.address && (
                              <p className="text-xs text-destructive font-medium flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                                {errors.address}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <strong>Nota:</strong> Los envíos al interior se realizan vía Metro Pac o Caribe Pack con cobro en destino. En Santo Domingo tenemos mensajería privada.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="notes" className="text-sm font-semibold text-muted-foreground">
                          Observaciones
                        </Label>
                        <textarea
                          id="notes"
                          placeholder="Ej: Llamar antes de llegar, empaque especial..."
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 min-h-[80px] resize-none"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Opcional. Instrucciones especiales para tu pedido.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 gap-3 group transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
                    onClick={() => {
                      const newErrors: typeof errors = {};
                      if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
                      if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
                      if (formData.delivery === "shipping" && !formData.address.trim()) newErrors.address = "La dirección es requerida para el envío";

                      if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                        toast.error("Por favor completa los campos requeridos");
                        return;
                      }
                      setStep("payment");
                    }}
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-foreground/20 text-sm">
                      1
                    </span>
                    Continuar al Pago
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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
                      <h2 className="font-heading text-base leading-snug font-medium flex items-center gap-3">
                        <Banknote className="w-6 h-6 text-primary" />
                        Método de Pago
                      </h2>
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
                          <h3 className="font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            ¿Cómo funciona?
                          </h3>
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
                        <h3 className="font-bold mb-6">Nuestras Cuentas Bancarias</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {bankAccounts.map((acc, idx) => (
                            <div key={idx} className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-colors hover:border-primary/30">
                              <div className={`h-2 ${bankStyles[acc.bank]?.accent || "bg-primary"}`} />
                              <div className="space-y-3 p-5">
                              <div className="flex justify-between items-start">
                                <span className={`font-black text-xs uppercase tracking-widest ${bankStyles[acc.bank]?.text || "text-primary"}`}>{acc.bank}</span>
                                <Badge variant="outline" className="text-[10px]">{acc.currency}</Badge>
                              </div>
                              <div className="flex justify-between items-center group/btn">
                                <span className={`rounded-lg px-2 py-1 font-mono text-lg font-bold ${bankStyles[acc.bank]?.soft || "bg-muted"}`}>{acc.accountNumber}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 text-muted-foreground ${bankStyles[acc.bank]?.hover || "hover:text-primary"}`}
                                  onClick={() => handleCopy(acc.accountNumber, "Número de cuenta")}
                                  aria-label="Copiar número de cuenta"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                <p>{acc.holder}</p>
                                <p>{acc.accountType}</p>
                              </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 gap-3 group transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    onClick={handleFinalize}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-foreground/20 text-sm">
                          2
                        </span>
                        Confirmar Pedido
                        <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </>
                    )}
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
                    <p className="text-muted-foreground text-lg">Tu orden ha sido generada correctamente.</p>
                  </div>

                  <div className="max-w-md mx-auto p-8 bg-card border-2 border-dashed border-primary/20 rounded-[2.5rem] space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Código de Orden</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl font-black text-primary font-mono tracking-wide">{orderId}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(orderId);
                            toast.success("Código copiado");
                          }}
                          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                          aria-label="Copiar código"
                        >
                          <Copy className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <p className="font-medium text-sm">Para procesar tu envío, envíanos el comprobante de transferencia indicando tu código de orden:</p>
                      <Button
                        className="w-full h-16 rounded-2xl text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20 gap-3"
                        onClick={sendWhatsApp}
                      >
                        <WhatsApp size={24} />
                        Enviar Comprobante
                      </Button>
                    </div>
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
                  <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary text-primary-foreground rounded-lg">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      Resumen del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-5">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border/50">
                            <Image src={item.images[0]} alt={item.name} fill unoptimized={isMinioImage(item.images[0])} sizes="56px" className="object-cover" />
                            {item.quantity > 1 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-card">
                                {item.quantity}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <p className="font-bold truncate text-sm">{item.name}</p>
                            <p className="text-muted-foreground text-xs">RD$ {item.price.toLocaleString("es-DO")} c/u</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? "artículo" : "artículos"})</span>
                        <span className="font-medium">RD$ {totalPrice().toLocaleString("es-DO")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          {formData.delivery === "pickup" ? <MapPin className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                          Envío
                        </span>
                        <span className="font-medium">{formData.delivery === "pickup" ? "Gratis" : "RD$ 300+"}</span>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">Total</span>
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">RD$ {totalPrice().toLocaleString("es-DO")}</div>
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
