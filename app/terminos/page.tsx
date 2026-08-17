import { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Morel Technology",
  description: "Términos y condiciones de uso y venta de Morel Technology en República Dominicana.",
  alternates: {
    canonical: "/terminos",
  },
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Última actualización: 17 de agosto de 2026
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground">

          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web de Morel Technology (moreltechnologyrd.com) y nuestros servicios, usted acepta estos términos y condiciones en su entirety. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestro sitio web.
          </p>

          <h2>2. Productos y Servicios</h2>
          <p>
            Morel Technology se dedica a la venta de laptops y accesorios tecnológicos en República Dominicana. Todos los productos ofrecidos están sujetos a disponibilidad. Nos reservamos el derecho de modificar o descontinuar productos sin previo aviso.
          </p>
          <ul>
            <li>Las imágenes de los productos son referenciales y pueden diferir ligeramente del producto real</li>
            <li>Los precios están en pesos dominicanos (RD$) e incluyen impuestos</li>
            <li>Los precios pueden cambiar sin previo aviso</li>
          </ul>

          <h2>3. Garantía</h2>
          <p>
            Todos nuestros productos incluyen garantía según las siguientes condiciones:
          </p>
          <ul>
            <li><strong>Laptops nuevas:</strong> 1 año de garantía</li>
            <li><strong>Laptops usadas certificadas:</strong> 6 meses de garantía</li>
            <li>La garantía cubre defectos de hardware</li>
            <li>La garantía no cubre daños físicos, líquidos o mal uso</li>
          </ul>

          <h2>4. Financiamiento</h2>
          <p>
            Ofrecemos opciones de financiamiento a través de entidades financieras aliadas. Los términos del financiamiento están sujetos a aprobación crediticia y pueden variar según la entidad financiera.
          </p>
          <ul>
            <li>Se requiere cédula de identidad y comprobante de ingresos</li>
            <li>Los plazos y tasas de interés son determinados por la entidad financiera</li>
            <li>Morel Technology no es responsable de decisiones de crédito</li>
          </ul>

          <h2>5. Envíos</h2>
          <p>
            Realizamos envíos a todo el territorio nacional. Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad del producto.
          </p>
          <ul>
            <li>Santo Domingo: 1-2 días hábiles</li>
            <li>Otras provincias: 3-7 días hábiles</li>
            <li>El costo de envío puede variar según la ubicación</li>
          </ul>

          <h2>6. Devoluciones</h2>
          <p>
            Aceptamos devoluciones dentro de los primeros 15 días naturales después de la compra, sujeto a las siguientes condiciones:
          </p>
          <ul>
            <li>El producto debe estar en las mismas condiciones en que fue entregado</li>
            <li>Debe incluir todos los accesorios y empaque original</li>
            <li>No se aceptan devoluciones de productos dañados por mal uso</li>
          </ul>

          <h2>7. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos, diseños y software, es propiedad de Morel Technology y está protegido por las leyes de propiedad intelectual de República Dominicana.
          </p>

          <h2>8. Limitación de Responsabilidad</h2>
          <p>
            Morel Technology no será responsable por:
          </p>
          <ul>
            <li>Daños indirectos o consecuentes derivados del uso de nuestros productos</li>
            <li>Interrupciones del servicio o errores en el sitio web</li>
            <li>Pérdida de datos o negocios</li>
          </ul>

          <h2>9. Ley Aplicable</h2>
          <p>
            Estos términos y condiciones se rigen por las leyes de la República Dominicana. Cualquier disputa será resuelta ante los tribunales competentes de Santo Domingo.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para preguntas sobre estos términos y condiciones, puede contactarnos:
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
