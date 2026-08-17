import { Metadata } from "next";
import { branches } from "@/lib/data";
import CatalogoBranchClient from "./catalogo-client";

interface PageProps {
  params: Promise<{ branch: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branch } = await params;
  const branchData = branches.find(b => b.id === branch);
  const branchName = branchData ? branchData.name.replace("Sucursal ", "") : branch;

  return {
    title: `Catálogo de Laptops ${branchName} | Morel Technology`,
    description: `Explora el catálogo completo de laptops disponibles en la sucursal ${branchName} de Morel Technology. Equipos nuevos y usados con garantía.`,
    alternates: {
      canonical: `/catalogo/${branch}`,
    },
    openGraph: {
      title: `Catálogo de Laptops ${branchName} | Morel Technology`,
      description: `Explora el catálogo completo de laptops disponibles en la sucursal ${branchName} de Morel Technology.`,
    },
  };
}

export default async function CatalogoBranchPage({ params }: PageProps) {
  const { branch } = await params;
  return <CatalogoBranchClient branch={branch} />;
}
