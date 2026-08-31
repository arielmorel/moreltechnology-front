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
    description: "Noticias, guías y recomendaciones de hardware para videojuegos",
    color: "bg-category-gaming text-category-gaming-fg",
    textColor: "text-purple-600 dark:text-purple-400",
    icon: "Gamepad2",
  },
  {
    slug: "laptops",
    name: "Laptops",
    description: "Comparativas, reviews y guías de compra de laptops",
    color: "bg-category-laptops text-category-laptops-fg",
    textColor: "text-blue-600 dark:text-blue-400",
    icon: "Laptop",
  },
  {
    slug: "tecnologia",
    name: "Tecnología",
    description: "Tendencias, novedades y análisis del mundo tech",
    color: "bg-category-tecnologia text-category-tecnologia-fg",
    textColor: "text-emerald-600 dark:text-emerald-400",
    icon: "Cpu",
  },
  {
    slug: "guias",
    name: "Guías",
    description: "Guias paso a paso para sacar el máximo partido a tu equipo",
    color: "bg-category-guia text-category-guia-fg",
    textColor: "text-amber-600 dark:text-amber-400",
    icon: "BookOpen",
  },
  {
    slug: "gta-6",
    name: "GTA 6",
    description: "Todo sobre los requisitos, laptops y hardware recomendado para GTA 6",
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
