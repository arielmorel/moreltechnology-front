"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { blogCategories } from "@/lib/data/blog-categories";
import { Gamepad2, Laptop, Cpu, BookOpen, Crosshair } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Gamepad2,
  Laptop,
  Cpu,
  BookOpen,
  Crosshair,
};

interface BlogFiltersProps {
  activeCategory?: string;
}

export function BlogFilters({ activeCategory }: BlogFiltersProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || activeCategory || "";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          !currentCategory
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        Todos
      </Link>
      {blogCategories.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        const isActive = currentCategory === cat.slug;
        return (
          <Link
            key={cat.slug}
            href={`/blog?category=${cat.slug}`}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              isActive
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
