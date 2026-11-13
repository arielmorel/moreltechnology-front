import type { Metadata } from "next";

const TITLE = "Envíos de Laptops a Todo RD | Morel Technology";
const DESCRIPTION = "Enviamos laptops a todas las provincias de República Dominicana. Delivery el mismo día en el Gran Santo Domingo y envíos nacionales por MetroPac, Caribe Pack y BM Cargo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/envios" },

  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: "Morel Technology",
    url: "/envios",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
