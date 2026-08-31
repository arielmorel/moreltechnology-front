import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { BlogPostSummary } from "@/lib/blog";
import { getCategoryColorClass } from "@/lib/data/blog-categories";

interface BlogCardProps {
  post: BlogPostSummary;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className={cn(
          "h-full bg-card border border-border/50 rounded-2xl overflow-hidden transition-all hover:border-border hover:shadow-sm",
          featured && "md:col-span-2 lg:col-span-2"
        )}
      >
        <div className={cn("flex flex-col h-full", featured ? "p-8 sm:p-10" : "p-6")}>
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                  getCategoryColorClass(post.category)
                )}
              >
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString("es-DO", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {post.updatedAt && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                <Clock className="w-3 h-3" />
                Actualizado
              </span>
            )}
          </div>

          <h2
            className={cn(
              "font-bold mb-3 group-hover:text-foreground transition-colors line-clamp-2",
              featured ? "text-2xl" : "text-lg"
            )}
          >
            {post.title}
          </h2>

          <p
            className={cn(
              "text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1",
              featured ? "text-base" : "text-sm"
            )}
          >
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex px-2 py-0.5 rounded bg-muted/50 text-[11px] text-muted-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Leer artículo
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}
