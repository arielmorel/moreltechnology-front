import type { Metadata } from "next";

const TITLE = "Finalizar Compra | Morel Technology";
const DESCRIPTION = "Completa tu pedido de Morel Technology.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: "Morel Technology",
    url: "/checkout",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
