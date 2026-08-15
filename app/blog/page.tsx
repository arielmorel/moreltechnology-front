import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Morel Technology República Dominicana",
  description: "Guías de compra, comparativas y consejos sobre laptops en República Dominicana. Expertos ayudándote a elegir.",
  alternates: {
    canonical: "/blog",
  },
};

function getCategoryColor(category: string): string {
  if (category === "Comparativa") return "bg-category-comparativa text-category-comparativa-fg";
  if (category === "Guía de Compra") return "bg-category-guia text-category-guia-fg";
  return "bg-muted text-muted-foreground";
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Blog
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tecnología &amp; Guías
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Comparativas, consejos de compra y todo lo que necesitas saber para elegir tu laptop ideal.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className={cn(
                  "h-full bg-card border border-border/50 rounded-2xl overflow-hidden transition-all hover:border-border",
                  index === 0 && "md:col-span-2 lg:col-span-2"
                )}>
                  <div className={cn(
                    "flex flex-col h-full",
                    index === 0 ? "p-8 sm:p-10" : "p-6"
                  )}>
                    <div className="flex items-center gap-3 mb-4">
                      {post.category && (
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                          getCategoryColor(post.category)
                        )}>
                          {post.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <h2 className={cn(
                      "font-bold mb-3 group-hover:text-foreground transition-colors line-clamp-2",
                      index === 0 ? "text-2xl" : "text-lg"
                    )}>
                      {post.title}
                    </h2>

                    <p className={cn(
                      "text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1",
                      index === 0 ? "text-base" : "text-sm"
                    )}>
                      {post.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Leer artículo
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Próximamente artículos</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Estamos preparando guías y comparativas para ayudarte a elegir tu laptop ideal.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
