import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aplicaciones Móviles - Morel Technology República Dominicana",
  description: "Descubre nuestras apps móviles para aprender conjugación de verbos en inglés, francés, alemán, italiano, portugués y español. Descarga gratuita y versión PRO disponible.",
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
