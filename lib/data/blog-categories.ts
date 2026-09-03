export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  icon: string;
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "gaming",
    name: "Gaming",
    description: "Juegos, PCs gaming, periféricos y rendimiento en videojuegos",
    color: "bg-category-gaming text-category-gaming-fg",
    textColor: "text-purple-600 dark:text-purple-400",
    icon: "Gamepad2",
  },
  {
    slug: "laptops",
    name: "Laptops",
    description: "Reviews, comparativas, recomendaciones y problemas de laptops",
    color: "bg-category-laptops text-category-laptops-fg",
    textColor: "text-blue-600 dark:text-blue-400",
    icon: "Laptop",
  },
  {
    slug: "hardware",
    name: "Hardware",
    description: "RAM, SSD, CPU, GPU, monitores, fuentes y upgrades",
    color: "bg-category-hardware text-category-hardware-fg",
    textColor: "text-rose-600 dark:text-rose-400",
    icon: "Cpu",
  },
  {
    slug: "software",
    name: "Software",
    description: "Windows, Linux, Blender, Office, programas y herramientas",
    color: "bg-category-software text-category-software-fg",
    textColor: "text-violet-600 dark:text-violet-400",
    icon: "Settings",
  },
  {
    slug: "arquitectura",
    name: "Arquitectura",
    description: "AutoCAD, Revit, SketchUp, renderizado y equipos para arquitectos",
    color: "bg-category-arquitectura text-category-arquitectura-fg",
    textColor: "text-amber-600 dark:text-amber-400",
    icon: "Building2",
  },
  {
    slug: "tecnologia",
    name: "Tecnología",
    description: "IA, tendencias, noticias y novedades tecnológicas",
    color: "bg-category-tecnologia text-category-tecnologia-fg",
    textColor: "text-emerald-600 dark:text-emerald-400",
    icon: "Brain",
  },
  {
    slug: "guias",
    name: "Guías",
    description: "Tutoriales, configuraciones, mantenimiento y soluciones",
    color: "bg-category-guia text-category-guia-fg",
    textColor: "text-amber-600 dark:text-amber-400",
    icon: "BookOpen",
  },
  {
    slug: "gta-6",
    name: "GTA 6",
    description: "Requisitos, laptops, hardware y noticias relacionadas con GTA 6",
    color: "bg-category-gta6 text-category-gta6-fg",
    textColor: "text-orange-600 dark:text-orange-400",
    icon: "Crosshair",
  },
];

export function getBlogCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getCategoryColorClass(category: string): string {
  const cat = blogCategories.find(
    (c) => c.name.toLowerCase() === category.toLowerCase() || c.slug === category.toLowerCase()
  );
  return cat?.color ?? "bg-muted text-muted-foreground";
}
