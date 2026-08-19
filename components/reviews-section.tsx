"use client";

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
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
            <Star className="w-4 h-4 fill-current" />
            Social Proof
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-8">
            <h2 className="animate-slide-up-delay-1 text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
              Lo que dicen{" "}
              <span className="text-primary">nuestros clientes.</span>
            </h2>
            <div className="animate-slide-up-delay-2 flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50 w-fit shrink-0 mx-auto sm:mx-0">
              <div className="text-center">
                <div className="text-2xl font-black">4.9</div>
                <div className="flex gap-0.5 text-yellow-500 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div className="text-xs font-medium text-muted-foreground">
                <span className="text-foreground font-bold block">+500</span>
                Reviews
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="pl-3 basis-[85vw] sm:basis-1/2 lg:basis-1/3">
                <div className="animate-scale-in h-full p-5 md:p-7 bg-card border border-border/50 rounded-2xl md:rounded-3xl flex flex-col shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                  {/* Stars */}
                  <div className="flex gap-0.5 text-yellow-500 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-5 md:mb-6">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 md:w-10 md:h-10 text-primary/10 -z-10" />
                    <p className="text-sm md:text-base font-medium leading-relaxed italic line-clamp-5">
                      &ldquo;{review.content}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div className="mt-auto pt-4 md:pt-5 border-t border-border/50 flex items-center gap-3">
                    <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm md:text-base shrink-0">
                      {review.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm truncate">{review.author}</h4>
                        <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground">{review.date}</p>
                    </div>
                    <Image
                      src={review.avatar}
                      alt="Google"
                      width={18}
                      height={18}
                      className="opacity-40 sm:opacity-20 sm:group-hover:opacity-100 transition-opacity shrink-0"
                      sizes="18px"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-6">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-xl border-2" />
            <CarouselNext className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-xl border-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
