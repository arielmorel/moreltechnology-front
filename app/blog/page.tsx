import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Calendar, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Morel Technology República Dominicana",
  description: "Artículos sobre laptops, tecnología, guías de compra y comparativas en República Dominicana. Consejos de expertos para elegir tu laptop ideal.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Blog de <span className="text-primary">Tecnología</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Guías, comparativas y consejos para elegir la laptop perfecta en República Dominicana.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="h-full bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      {post.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {post.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                      Leer artículo
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-muted/30 rounded-[2rem] border border-dashed border-border/50 space-y-4">
            <p className="text-xl font-bold">Próximamente artículos de tecnología</p>
            <p className="text-muted-foreground">Estamos preparando guías y comparativas para ayudarte a elegir tu laptop ideal.</p>
          </div>
        )}

      </div>
    </div>
  );
}
