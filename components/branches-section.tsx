"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import { Facebook, Instagram, TikTok } from "@/components/icons";

import { branches } from "@/lib/data";

const branchLinks: Record<string, string> = {
  moreltechnology: "/tienda-laptops-santo-domingo",
  mts: "/tienda-laptops-santiago",
};

export function BranchesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Visita Nuestras Sucursales</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Estamos cada vez más cerca de ti. Ven y conoce nuestros equipos en persona o contáctanos por tus redes favoritas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="h-full rounded-3xl overflow-hidden border border-border/50 bg-card hover:shadow-xl hover:shadow-red-500/5 transition-all group">
                {/* Red top accent */}
                <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

                <div className="p-8 flex flex-col h-full relative">
                  <h3 className="text-2xl font-black tracking-tight mb-6">{branch.name}</h3>

                  <div className="space-y-4 mb-8 flex-1">
                    <a
                      href={branch.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group/map"
                    >
                      <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5 group-hover/map:scale-110 transition-transform" />
                      <span className="group-hover/map:underline">{branch.address}</span>
                    </a>

                    <a
                      href={branch.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <Phone className="w-5 h-5 text-green-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium group-hover:underline">{branch.phone}</span>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                    <Link
                      href={branchLinks[branch.id] || "/contacto"}
                      className="inline-flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all"
                    >
                      Visitar sucursal
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="flex gap-3">
                      <a
                        href={branch.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-muted rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-all"
                        aria-label="Instagram"
                      >
                        <Instagram size={18} />
                      </a>
                      <a
                        href={branch.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-muted rounded-full hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                        aria-label="Facebook"
                      >
                        <Facebook size={18} />
                      </a>
                      <a
                        href={branch.socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-muted rounded-full hover:bg-foreground/10 hover:text-foreground transition-all"
                        aria-label="TikTok"
                      >
                        <TikTok size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
