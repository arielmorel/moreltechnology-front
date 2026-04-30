"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import { Facebook, Instagram, TikTok } from "@/components/icons";

import { branches } from "@/lib/data";

export function BranchesSection() {
  return (
    <section className="py-24 bg-muted/20">
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
              <Card className={`h-full overflow-hidden border border-border/50 bg-gradient-to-br ${branch.color} backdrop-blur-sm hover:shadow-lg transition-all`}>
                <CardContent className="p-8 flex flex-col h-full relative">
                  {/* Decorational background element */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

                  <h3 className="text-2xl font-bold mb-6">{branch.name}</h3>

                  <div className="space-y-4 mb-8 flex-1">
                    <a 
                      href={branch.mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group/map"
                    >
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover/map:scale-110 transition-transform" />
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

                  <div className="pt-6 border-t border-border/50">
                    <p className="text-sm font-medium mb-4 text-muted-foreground">Nuestras Redes Sociales:</p>
                    <div className="flex gap-4">
                      <a
                        href={branch.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-background rounded-full shadow-sm hover:shadow-md hover:text-pink-500 transition-all"
                        aria-label="Instagram"
                      >
                        <Instagram size={20} />
                      </a>
                      <a
                        href={branch.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-background rounded-full shadow-sm hover:shadow-md hover:text-blue-600 transition-all"
                        aria-label="Facebook"
                      >
                        <Facebook size={20} />
                      </a>
                      <a
                        href={branch.socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-background rounded-full shadow-sm hover:shadow-md hover:text-black dark:hover:text-white transition-all"
                        aria-label="TikTok"
                      >
                        <TikTok size={20} />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
