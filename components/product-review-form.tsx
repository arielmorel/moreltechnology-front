"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createProductReview } from "@/app/actions/reviews";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Introduce un correo electrónico válido." }),
  rating: z
    .number()
    .min(1, { message: "Selecciona una valoración." })
    .max(5, { message: "Selecciona una valoración." }),
  title: z.string().optional(),
  comment: z
    .string()
    .min(10, { message: "El comentario debe tener al menos 10 caracteres." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductReviewFormProps {
  productId: number;
}

export function ProductReviewForm({ productId }: ProductReviewFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      title: "",
      comment: "",
    },
  });

  const {
    formState: { isSubmitting },
    setValue,
  } = form;

  async function onSubmit(values: FormValues) {
    const result = await createProductReview({
      productId,
      name: values.name,
      email: values.email,
      rating: values.rating,
      title: values.title,
      comment: values.comment,
    });

    if (result.success) {
      setIsSubmitted(true);
    } else {
      form.setError("root", { message: result.message });
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/30">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600 dark:text-green-400" />
        <h3 className="mb-2 text-lg font-bold text-green-800 dark:text-green-200">
          ¡Reseña enviada!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Tu reseña fue recibida y está pendiente de aprobación. Será publicada
          una vez que nuestro equipo la revise.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valoración</FormLabel>
                <FormControl>
                  <div
                    className="flex gap-1"
                    role="radiogroup"
                    aria-label="Selecciona una valoración de 1 a 5 estrellas"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={field.value === star}
                        aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
                        className={cn(
                          "h-10 w-10 rounded-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          "flex items-center justify-center"
                        )}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => {
                          field.onChange(star);
                          setValue("rating", star, { shouldValidate: true });
                        }}
                      >
                        <Star
                          style={{ fill: hoveredStar >= star || field.value >= star ? "#facc15" : "transparent" }}
                          className={cn(
                            "h-7 w-7 transition-colors",
                            (hoveredStar >= star || field.value >= star)
                              ? "text-yellow-400"
                              : "text-muted-foreground/40"
                          )}
                        />
                      </button>
                    ))}
                    {field.value > 0 && (
                      <span className="ml-2 flex items-center text-sm text-muted-foreground">
                        {field.value}/5
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
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
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Resumen de tu experiencia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentario</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Cuéntanos tu experiencia con este producto..."
                    className={cn(
                      "flex min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none",
                      "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                      "disabled:pointer-events-none disabled:opacity-50 md:text-sm",
                      "dark:bg-input/30"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar reseña"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
