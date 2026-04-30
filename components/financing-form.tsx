"use client";

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
import { MessageCircle, ShieldCheck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { WhatsApp } from "./icons";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  cedula: z.string().min(11, { message: "La cédula debe tener 11 dígitos." }).max(13),
  phone: z.string().min(10, { message: "Introduce un teléfono válido." }),
  salary: z.string().min(4, { message: "Introduce tu salario mensual en pesos." }),
  workTime: z.string().min(2, { message: "Ej: 1 año, 6 meses, etc." }),
  company: z.string().min(2, { message: "Nombre de la empresa donde laboras." }),
  equipment: z.string().optional(),
  branch: z.string().min(1, { message: "Selecciona una sucursal." }),
});

export function FinancingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      fullName: "",
      cedula: "",
      phone: "",
      salary: "",
      workTime: "",
      company: "",
      equipment: "",
      branch: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Buscar el número de WhatsApp de la sucursal seleccionada
    const selectedBranch = branches.find((b) => b.id === values.branch);
    const phoneToSend = selectedBranch ? selectedBranch.whatsappNumber : branches[0].whatsappNumber;

    // Crear el mensaje formateado
    const message = `*SOLICITUD DE FINANCIAMIENTO* 📝
    
*Datos Personales:*
👤 *Nombre:* ${values.fullName}
🪪 *Cédula:* ${values.cedula}
📱 *Teléfono:* ${values.phone}

*Datos Laborales:*
💼 *Empresa:* ${values.company}
💰 *Salario Mensual:* RD$ ${values.salary}
⏳ *Tiempo Laborando:* ${values.workTime}

*Interés:*
💻 *Equipo Deseado:* ${values.equipment || 'Aún no he decidido, busco asesoría'}
📍 *Sucursal Preferida:* ${selectedBranch?.name.replace('Sucursal ', '')}

¡Hola! Me gustaría saber si aplico para financiamiento con estos datos.`;

    // Redirigir a WhatsApp
    const whatsappUrl = `https://wa.me/${phoneToSend}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-card border border-border/50 rounded-2xl shadow-xl shadow-primary/5">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <CreditCard className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Solicitud Pre-Aprobación</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Completa tus datos reales. Esta información es 100% confidencial.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Juan Pérez" {...field} />
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
                    <Input placeholder="Sin guiones (Ej. 40200000000)" {...field} />
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
                    <Input placeholder="Ej. 809-555-5555" {...field} />
                  </FormControl>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Elige la sucursal más cercana" />
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

          <div className="bg-muted/30 p-5 rounded-xl border border-border/50 space-y-6">
            <div className="flex items-center gap-2 mb-4 text-primary font-medium">
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
                      <Input placeholder="Nombre de la empresa" {...field} />
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
                      <Input placeholder="Ej. 2 años y 4 meses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salario Mensual (DOP)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej. 35000" {...field} />
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
                <FormLabel>Equipo de Interés (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. MacBook Pro M3 o Asus ROG" {...field} />
                </FormControl>
                <FormDescription>
                  Si ya tienes una laptop en mente, déjanos saber cuál es.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold gap-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-600/20 transition-all mt-4"
            >
              <WhatsApp size={24} />
              Enviar Solicitud por WhatsApp
            </Button>
          </motion.div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Al enviar esta solicitud, nuestro equipo de ventas la evaluará rápidamente vía WhatsApp.
          </p>
        </form>
      </Form>
    </div>
  );
}
