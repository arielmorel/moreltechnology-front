import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aplicaciones Móviles - Morel Technology República Dominicana",
  description: "Apps para aprender conjugación de verbos en 6 idiomas. Descarga gratuita y versión PRO.",
  alternates: {
    canonical: "/apps",
  },
  openGraph: {
    title: "Aplicaciones Móviles - Morel Technology República Dominicana",
    description: "Apps móviles para aprender verbos en 6 idiomas. Descarga gratuita y versión PRO.",
    images: ["/images/apps/english.png"],
  },
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
