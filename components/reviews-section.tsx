"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { reviews } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-4 h-4 fill-current" />
              Social Proof
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Lo que dicen <br />
              <span className="text-primary">nuestros clientes.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-[2.5rem] border border-border/50">
            <div className="text-center">
              <div className="text-3xl font-black">4.9</div>
              <div className="flex gap-0.5 text-yellow-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-foreground font-bold block">+500</span>
              Reviews en Google
            </div>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="h-full p-8 bg-card border border-border/50 rounded-[2.5rem] flex flex-col shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex gap-0.5 text-yellow-500 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <div className="relative mb-8">
                    <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 -z-10" />
                    <p className="text-lg font-medium leading-relaxed italic">
                      "{review.content}"
                    </p>
                  </div>

                  <div className="mt-auto pt-8 border-t border-border/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {review.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold truncate">{review.author}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date} • Google Review</p>
                    </div>
                    <Image
                      src={review.avatar}
                      alt="Google"
                      width={20}
                      height={20}
                      className="opacity-20 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-2" />
            <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
