import type { Metadata } from "next";

const TITLE = "Comparador de Laptops | Morel Technology";
const DESCRIPTION = "Compara hasta 3 laptops lado a lado: procesador, RAM, almacenamiento, pantalla y precio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/comparar" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: "Morel Technology",
    url: "/comparar",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
