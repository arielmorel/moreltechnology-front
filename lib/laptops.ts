import { needsCategories } from "@/lib/data";

export const CATEGORY_LAPTOPS = "Laptops";

export function isLaptopCategory(category: string): boolean {
  const c = category.toLowerCase();
  return c === "laptop" || c === "laptops" || c === "portatiles" || c === "port\u00e1tiles";
}

export interface LaptopUse {
  id: string;
  name: string;
  title: string;
  description: string;
  seo: string;
  tag: string;
  productTags?: string[];
  href: string;
  blogSlug?: string;
}

const USE_DETAILS: Record<string, { name: string; title: string; blogSlug?: string; productTags?: string[] }> = {
  estudiantes: {
    name: "Estudiantes",
    title: "Laptops para Estudiantes en República Dominicana",
    blogSlug: "mejores-laptops-estudiantes-rd",
  },
  programacion: {
    name: "Programación",
    title: "Laptops para Programadores en República Dominicana",
    blogSlug: "laptops-para-programadores-2026",
  },
  gaming: {
    name: "Gaming",
    title: "Laptops Gaming en República Dominicana",
    blogSlug: "mejores-laptops-gaming-en-rd",
  },
  diseno: {
    name: "Diseño y Arquitectura",
    title: "Laptops para Diseño y Arquitectura en RD",
    blogSlug: "laptops-para-diseno-grafico",
    productTags: ["gamer", "arquitectura"],
  },
  oficina: {
    name: "Trabajo y Oficina",
    title: "Laptops para Trabajo en República Dominicana",
    blogSlug: "laptop-para-trabajo",
  },
};

export const LAPTOP_USES: LaptopUse[] = needsCategories.map((need) => {
  const detail = USE_DETAILS[need.id];
  const name = detail?.name ?? need.name;
  return {
    id: need.id,
    name,
    title: detail?.title ?? `Laptops para ${need.name} en República Dominicana`,
    description: need.description,
    seo: `Encuentra en Morel Technology las mejores laptops para ${name.toLowerCase()} en Santo Domingo y República Dominicana: equipos nuevos y usados certificados con el mejor precio, garantía local, financiamiento y envío a todo el país.`,
    tag: need.tags[0],
    productTags: detail?.productTags,
    href: need.href,
    blogSlug: detail?.blogSlug,
  };
});