"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branches } from "@/lib/data";
import { ShieldCheck, CreditCard, Send, CheckCircle, User, Briefcase, MessageCircle, Copy, FileText } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8282";
const API_FINANCING_URL = `${API_BASE_URL}/api/company/moreltechnology/financing/requests`;

const formSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  cedula: z.string().min(11, { message: "La cédula debe tener 11 dígitos." }).max(13),
  phone: z.string().min(10, { message: "Introduce un teléfono válido." }),
  email: z.string().email({ message: "Introduce un correo válido." }),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  address: z.string().optional(),
  salary: z.string().min(4, { message: "Introduce tu salario mensual en pesos." }),
  otherIncome: z.string().optional(),
  loanAmount: z.string().min(4, { message: "Introduce el monto del préstamo." }),
  workTime: z.string().min(2, { message: "Ej: 1 año, 6 meses, etc." }),
  company: z.string().min(2, { message: "Nombre de la empresa donde laboras." }),
  equipment: z.string().optional(),
  branch: z.string().min(1, { message: "Selecciona una sucursal." }),
});

export function FinancingForm({ initialBranch }: { initialBranch?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");
  const [branchValue, setBranchValue] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      fullName: "",
      cedula: "",
      phone: "",
      email: "",
      gender: "",
      maritalStatus: "",
      address: "",
      salary: "",
      otherIncome: "",
      loanAmount: "",
      workTime: "",
      company: "",
      equipment: "",
      branch: "",
    },
  });

  useEffect(() => {
    if (initialBranch) {
      setBranchValue(initialBranch);
      form.setValue("branch", initialBranch);
    }
  }, [initialBranch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const selectedBranch = branches.find((b) => b.id === values.branch);
      const payload = {
        fullName: values.fullName,
        cedula: values.cedula.replace(/-/g, ""),
        phone: values.phone,
        email: values.email,
        gender: values.gender || null,
        maritalStatus: values.maritalStatus || null,
        address: values.address || null,
        loanAmount: parseFloat(values.loanAmount),
        salary: parseFloat(values.salary),
        otherIncome: values.otherIncome ? parseFloat(values.otherIncome) : null,
        workTime: values.workTime,
        company: values.company,
        equipment: values.equipment || null,
        branchId: selectedBranch ? selectedBranch.id : null,
        source: "web",
      };

      const res = await fetch(API_FINANCING_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Public-App-Token": process.env.NEXT_PUBLIC_APP_TOKEN || "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar la solicitud");

      const data = await res.json().catch(() => null);
      setRequestNumber(data?.requestNumber || "");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedBranch = branches.find((b) => b.id === form.getValues("branch"));
  const whatsappNumber = selectedBranch?.whatsappNumber || "18096175517";
  const whatsappMessage = encodeURIComponent(
    `Hola, mi solicitud de pre-aprobación es ${requestNumber}. Me gustaría recibir más información.`
  );

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(requestNumber);
    toast.success("Número copiado al portapapeles");
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-2xl">
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Solicitud de Pre-Aprobación</h2>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-12 sm:py-16 text-center space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 dark:bg-green-950/30 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              ¡Solicitud enviada!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tu solicitud fue recibida correctamente. Te contactaremos en un plazo de 24 a 48 horas para continuar con el proceso.
            </p>
          </div>

          <div className="inline-flex flex-col items-center gap-2 p-5 bg-muted/40 border border-border/50 rounded-xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Número de solicitud
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold font-mono tracking-wider">
                {requestNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Copiar número"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Compartir por WhatsApp
            </a>
            <Button
              variant="outline"
              className="h-10 gap-2"
              onClick={() => {
                setIsSuccess(false);
                setRequestNumber("");
              }}
            >
              <FileText className="w-4 h-4" />
              Nueva solicitud
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-2xl">
      {/* Header */}
      <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Solicitud de Pre-Aprobación</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Completa tus datos reales. Esta información es 100% confidencial.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-10">
            {/* Section: Datos Personales */}
            <fieldset className="space-y-5">
              <legend className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                Datos Personales
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" placeholder="Ej. Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula de Identidad</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" placeholder="Sin guiones (Ej. 40200000000)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select value={field.value} onValueChange={(val) => field.onChange(val || "")}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar">
                              {field.value === "M" ? "Masculino" : field.value === "F" ? "Femenino" : field.value === "Otro" ? "Otro" : "Seleccionar"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => {
                    const maritalLabels: Record<string, string> = {
                      "Soltero": "Soltero/a",
                      "Casado": "Casado/a",
                      "Divorciado": "Divorciado/a",
                      "Viudo": "Viudo/a",
                      "Union Libre": "Unión Libre",
                    };
                    return (
                    <FormItem>
                      <FormLabel>Estado Civil</FormLabel>
                      <Select value={field.value} onValueChange={(val) => field.onChange(val || "")}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar">
                              {field.value ? (maritalLabels[field.value] || "Seleccionar") : "Seleccionar"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Soltero">Soltero/a</SelectItem>
                          <SelectItem value="Casado">Casado/a</SelectItem>
                          <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                          <SelectItem value="Viudo">Viudo/a</SelectItem>
                          <SelectItem value="Union Libre">Unión Libre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => {
                    const isDisabled = !!initialBranch;
                    return (
                    <FormItem>
                      <FormLabel>Sucursal</FormLabel>
                      <Select
                        value={branchValue || undefined}
                        onValueChange={(val) => {
                          setBranchValue(val || "");
                          field.onChange(val || "");
                        }}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger className={isDisabled ? "opacity-80" : ""}>
                            <SelectValue placeholder="Elige la sucursal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name.replace('Sucursal ', '')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isDisabled && (
                        <FormDescription>
                          {branches.find((b) => b.id === initialBranch)?.name || "Sucursal"} preseleccionada desde el enlace.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                    );
                  }}
                />
              </div>
            </fieldset>

            {/* Section: Contacto */}
            <fieldset className="space-y-5">
              <legend className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                Contacto
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono / WhatsApp</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" placeholder="Ej. 809-555-5555" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" type="email" placeholder="Ej. juan@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input className="placeholder:text-muted-foreground/50" placeholder="Ej. Calle Principal #123, Santo Domingo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Section: Situación Financiera */}
            <fieldset className="space-y-5">
              <legend className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                <CreditCard className="w-3.5 h-3.5" />
                Situación Financiera
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salario Mensual (DOP)</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" type="number" placeholder="Ej. 35000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otros Ingresos</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" type="number" placeholder="Ej. 5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto del Préstamo (DOP)</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" type="number" placeholder="Ej. 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            {/* Section: Empleo */}
            <fieldset className="space-y-5">
              <legend className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" />
                Empleo
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa donde laboras</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" placeholder="Nombre de la empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiempo Laborando</FormLabel>
                      <FormControl>
                        <Input className="placeholder:text-muted-foreground/50" placeholder="Ej. 2 años y 4 meses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipo de Interés</FormLabel>
                    <FormControl>
                      <Input className="placeholder:text-muted-foreground/50" placeholder="Ej. MacBook Pro M3 o Asus ROG" {...field} />
                    </FormControl>
                    <FormDescription>
                      Si ya tienes una laptop en mente, déjanos saber cuál es.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-10 py-6 sm:py-8 border-t border-border/50 bg-muted/20 rounded-b-2xl">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Solicitud
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Al enviar esta solicitud, nuestro equipo de ventas la evaluará y te contactará pronto.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
