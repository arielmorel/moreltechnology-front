import type { Metadata } from "next";

const TITLE = "Soporte Técnico para Laptops en RD | Morel Technology";
const DESCRIPTION = "Soporte técnico para laptops en República Dominicana: diagnóstico de hardware, optimización de software, soporte remoto y asistencia postventa por WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/soporte" },

  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: "Morel Technology",
    url: "/soporte",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
