import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts, getPostsByCategory } from "@/lib/blog";
import { blogCategories, getBlogCategoryBySlug } from "@/lib/data/blog-categories";
import { BlogCard } from "@/components/blog-card";
import { BlogFilters } from "@/components/blog-filters";
import { BookOpen, Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Morel Technology República Dominicana",
  description: "Guías de compra, comparativas, gaming y tecnología en República Dominicana. Expertos ayudándote a elegir la laptop ideal.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog - Morel Technology República Dominicana",
    description: "Guías de compra, comparativas, gaming y tecnología en RD.",
    type: "website",
    locale: "es_DO",
    siteName: "Morel Technology",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const posts = category ? getPostsByCategory(category) : getAllPosts();
  const activeCategory = category ? getBlogCategoryBySlug(category) : null;

  const gta6Posts = getAllPosts().filter((p) => p.category === "GTA 6");

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Blog
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {activeCategory ? activeCategory.name : "Tecnología, Gaming & Guías"}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {activeCategory
              ? activeCategory.description
              : "Comparativas, consejos de compra y todo lo que necesitas saber para elegir tu laptop ideal."}
          </p>
        </div>

        {/* GTA 6 Banner */}
        {!category && gta6Posts.length > 0 && (
          <Link href="/blog?category=gta-6" className="group block mb-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 border border-orange-500/20 p-6 sm:p-8 transition-all hover:border-orange-500/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10">
                  <Gamepad2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-orange-600 transition-colors">
                    GTA 6 — Guías, Requisitos y Laptops Recomendadas
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Todo lo que necesitas saber para jugar GTA 6: GPUs, requisitos, laptops por presupuesto y más.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 transition-all group-hover:translate-x-1 hidden sm:block" />
              </div>
            </div>
          </Link>
        )}

        {/* Category Filters */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <BlogFilters activeCategory={category} />
          </Suspense>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} featured={index === 0 && !category} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No hay artículos en esta categoría</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Estamos preparando contenido para esta categoría. Vuelve pronto.
            </p>
          </div>
        )}

        {/* Categories Overview (only on main blog page) */}
        {!category && (
          <div className="mt-16 pt-12 border-t border-border/50">
            <h2 className="text-xl font-bold mb-6">Explorar por Categoría</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {blogCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className="group p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-all"
                >
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-foreground transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
