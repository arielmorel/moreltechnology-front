"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { ShieldCheck, CreditCard, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/products$/, "") || "http://localhost:8282/api/catalogs/moreltechnology";

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
  workTime: z.string().min(2, { message: "Ej: 1 año, 6 meses, etc." }),
  company: z.string().min(2, { message: "Nombre de la empresa donde laboras." }),
  equipment: z.string().optional(),
  branch: z.string().min(1, { message: "Selecciona una sucursal." }),
});

export function FinancingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      workTime: "",
      company: "",
      equipment: "",
      branch: "",
    },
  });

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
        loanAmount: 0,
        salary: parseFloat(values.salary),
        otherIncome: values.otherIncome ? parseFloat(values.otherIncome) : null,
        workTime: values.workTime,
        company: values.company,
        equipment: values.equipment || null,
        branchId: selectedBranch ? parseInt(selectedBranch.id) : null,
        source: "web",
      };

      const res = await fetch(`${API_BASE}/financing/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar la solicitud");

      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-card border border-border/50 rounded-2xl shadow-xl shadow-primary/5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-border/50">
        <div className="bg-primary/10 p-3 rounded-full text-primary self-start">
          <CreditCard className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Solicitud Pre-Aprobación</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Completa tus datos reales. Esta información es 100% confidencial.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isSuccess && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">¡Solicitud enviada correctamente! Te contactaremos pronto.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input className="h-11 sm:h-12" placeholder="Ej. Juan Pérez" {...field} />
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
                    <Input className="h-11 sm:h-12" placeholder="Sin guiones (Ej. 40200000000)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono / WhatsApp</FormLabel>
                  <FormControl>
                    <Input className="h-11 sm:h-12" placeholder="Ej. 809-555-5555" {...field} />
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
                    <Input className="h-11 sm:h-12" type="email" placeholder="Ej. juan@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género (Opcional)</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val || "")} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 sm:h-12">
                        <SelectValue placeholder="Seleccionar" />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Civil (Opcional)</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val || "")} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 sm:h-12">
                        <SelectValue placeholder="Seleccionar" />
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
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal Preferida</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val || "")} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 sm:h-12">
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
                <FormLabel>Dirección (Opcional)</FormLabel>
                <FormControl>
                  <Input className="h-11 sm:h-12" placeholder="Ej. Calle Principal #123, Santo Domingo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border/50 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 text-primary font-medium">
              <ShieldCheck className="w-5 h-5" />
              Datos Laborales
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa donde laboras</FormLabel>
                    <FormControl>
                      <Input className="h-11 sm:h-12" placeholder="Nombre de la empresa" {...field} />
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
                      <Input className="h-11 sm:h-12" placeholder="Ej. 2 años y 4 meses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Mensual (DOP)</FormLabel>
                    <FormControl>
                      <Input className="h-11 sm:h-12" type="number" placeholder="Ej. 35000" {...field} />
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
                    <FormLabel>Otros Ingresos (Opcional)</FormLabel>
                    <FormControl>
                      <Input className="h-11 sm:h-12" type="number" placeholder="Ej. 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="equipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo de Interés (Opcional)</FormLabel>
                <FormControl>
                    <Input className="h-11 sm:h-12" placeholder="Ej. MacBook Pro M3 o Asus ROG" {...field} />
                </FormControl>
                <FormDescription>
                  Si ya tienes una laptop en mente, déjanos saber cuál es.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botón de WhatsApp comentado - Ahora se envía al servidor
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold gap-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-600/20 transition-all mt-4"
            >
              <WhatsApp size={24} />
              Enviar Solicitud por WhatsApp
            </Button>
          </motion.div>
          */}

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xl shadow-primary/20 transition-all mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </motion.div>
          <p className="text-center text-xs text-muted-foreground mt-3 sm:mt-4">
            Al enviar esta solicitud, nuestro equipo de ventas la evaluará y te contactará pronto.
          </p>
        </form>
      </Form>
    </div>
  );
}
