import { branches } from "@/lib/data";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Facebook, Instagram, TikTok, GoogleMaps } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";

export default function ContactoPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Estamos aquí para <span className="text-primary">ayudarte.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            ¿Tienes alguna duda sobre un equipo o necesitas asesoría técnica? Elige la sucursal más cercana o escríbenos directamente por nuestras redes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Sucursales List */}
          <div className="space-y-8">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-primary">{branch.name}</h2>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="w-5 h-5 text-primary shrink-0" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-5 h-5 text-primary shrink-0" />
                        <span>{branch.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <span>Lunes - Sábado: 9:00 AM - 7:00 PM</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        render={<a href={branch.socials.instagram} target="_blank" rel="noreferrer" />}
                        className="rounded-full"
                      >
                        <Instagram size={18} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        render={<a href={branch.socials.facebook} target="_blank" rel="noreferrer" />}
                        className="rounded-full"
                      >
                        <Facebook size={18} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        render={<a href={branch.socials.tiktok} target="_blank" rel="noreferrer" />}
                        className="rounded-full"
                      >
                        <TikTok size={18} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3 min-w-[200px]">
                    <WhatsAppDropdown
                      message={`Hola, estoy contactando a la ${branch.name}.`}
                      className="w-full rounded-2xl h-12"
                    >
                      Hablar por WhatsApp
                    </WhatsAppDropdown>
                    <Button 
                      variant="secondary" 
                      className="w-full rounded-2xl h-12 gap-2" 
                      render={<a href={branch.mapLink} target="_blank" rel="noreferrer" />}
                    >
                      <GoogleMaps size={20} />
                      Ver en Google Maps
                    </Button>
                  </div>
                </div>

                {/* Map Embed Section */}
                <div className="mt-12 rounded-[2rem] overflow-hidden border border-border/50 bg-muted/30 aspect-video md:aspect-[21/9] w-full">
                  <iframe
                    src={branch.embedLink}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${branch.name}`}
                    className="grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* General Contact Form / Info */}
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">¿Ventas al por mayor?</h3>
            <p className="text-muted-foreground mb-8">
              Si eres una empresa o institución y necesitas una cotización corporativa para múltiples equipos, escríbenos directamente a nuestro correo central o vía WhatsApp corporativo.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-background rounded-2xl border border-border/50">
                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Correo Central</p>
                <p className="text-xl font-semibold">moreltechnology@gmail.com</p>
              </div>

              <div className="p-6 bg-background rounded-2xl border border-border/50">
                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Atención Nacional</p>
                <p className="text-xl font-semibold">809-617-5517</p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-sm text-muted-foreground">
                Morel Technology es una empresa registrada en República Dominicana. Todos nuestros equipos incluyen factura con valor fiscal (NCF) si lo requiere.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
