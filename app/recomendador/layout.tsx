import type { Metadata } from "next";

const TITLE = "¿Qué Laptop Comprar? Recomendador Gratis | Morel Technology RD";
const DESCRIPTION = "Responde 3 preguntas sobre uso, presupuesto y marca y te recomendamos la laptop ideal disponible en República Dominicana, con garantía y envío a todo el país.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/recomendador" },

  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: "Morel Technology",
    url: "/recomendador",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
