import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | Morel Technology",
  description: "Conoce cómo Morel Technology protege y maneja tu información personal al utilizar nuestros servicios.",
  alternates: {
    canonical: "/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Política de Privacidad
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Última actualización: 17 de agosto de 2026
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground">

          <h2>1. Información que Recopilamos</h2>
          <p>
            En Morel Technology recopilamos información que usted nos proporciona directamente al realizar una compra, solicitar financiamiento o contactarnos, incluyendo:
          </p>
          <ul>
            <li>Nombre completo y número de identificación</li>
            <li>Dirección de correo electrónico y número de teléfono</li>
            <li>Dirección de envío y facturación</li>
            <li>Información de pago y financiamiento</li>
            <li>Datos de navegación en nuestro sitio web</li>
          </ul>

          <h2>2. Uso de la Información</h2>
          <p>
            Utilizamos su información personal para:
          </p>
          <ul>
            <li>Procesar y completar sus pedidos</li>
            <li>Gestionar solicitudes de financiamiento</li>
            <li>Enviar actualizaciones sobre el estado de su pedido</li>
            <li>Brindar soporte técnico y atención al cliente</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Enviar comunicaciones promocionales (con su consentimiento)</li>
          </ul>

          <h2>3. Protección de Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos conexiones seguras (SSL/TLS) y sistemas de pago cifrados.
          </p>

          <h2>4. Compartir Información</h2>
          <p>
            No vendemos ni compartimos su información personal con terceros, excepto en los siguientes casos:
          </p>
          <ul>
            <li>Entidades financieras para procesar solicitudes de financiamiento</li>
            <li>Empresas de envío para entregar sus pedidos</li>
            <li>Cuando lo requiera la ley o una orden judicial</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>
            Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación, recordar sus preferencias y analizar el tráfico del sitio. Puede configurar su navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio.
          </p>

          <h2>6. Sus Derechos</h2>
          <p>
            Usted tiene derecho a:
          </p>
          <ul>
            <li>Acceder a su información personal</li>
            <li>Solicitar la corrección de datos inexactos</li>
            <li>Solicitar la eliminación de su información</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Solicitar la portabilidad de sus datos</li>
          </ul>

          <h2>7. Retención de Datos</h2>
          <p>
            Conservamos su información personal solo durante el tiempo necesario para cumplir con los fines para los que fue recopilada, o según lo requiera la ley.
          </p>

          <h2>8. Menores de Edad</h2>
          <p>
            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionadamente información personal de menores de edad.
          </p>

          <h2>9. Cambios en esta Política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de la última actualización.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta política de privacidad o sobre el manejo de su información personal, puede contactarnos:
          </p>
          <ul>
            <li><strong>Correo electrónico:</strong> info@moreltechnologyrd.com</li>
            <li><strong>Teléfono:</strong> (809) 617-5517</li>
            <li><strong>Dirección:</strong> Santo Domingo y Santiago, República Dominicana</li>
          </ul>

        </article>
      </div>
    </div>
  );
}
