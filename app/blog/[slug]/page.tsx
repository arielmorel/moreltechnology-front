import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog";
import { getBlogCategoryBySlug, getCategoryColorClass } from "@/lib/data/blog-categories";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { Calendar, User, ArrowLeft, Tag, Clock, ArrowRight, ShoppingBag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Artículo no encontrado | Morel Technology" };
  }

  const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return {
    title: `${post.title} | Morel Technology Blog`,
    description: post.description.substring(0, 160),
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || undefined,
      authors: [post.author],
      tags: post.tags,
      siteName: "Morel Technology",
      locale: "es_DO",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description.substring(0, 200),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);
  const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const categoryInfo = getBlogCategoryBySlug(categorySlug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://moreltechnologyrd.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Morel Technology",
      logo: {
        "@type": "ImageObject",
        url: "https://moreltechnologyrd.com/logo/moreltechnology.png",
      },
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://moreltechnologyrd.com/blog/${post.slug}`,
    },
    url: `https://moreltechnologyrd.com/blog/${post.slug}`,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "es",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://moreltechnologyrd.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://moreltechnologyrd.com/blog" },
      ...(categoryInfo
        ? [{ "@type": "ListItem" as const, position: 3 as const, name: categoryInfo.name, item: `https://moreltechnologyrd.com/blog?category=${categorySlug}` }]
        : []),
      {
        "@type": "ListItem" as const,
        position: (categoryInfo ? 4 : 3) as unknown as 3 | 4,
        name: post.title,
        item: `https://moreltechnologyrd.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          {categoryInfo && (
            <>
              <span>/</span>
              <Link
                href={`/blog?category=${categorySlug}`}
                className="hover:text-primary transition-colors"
              >
                {categoryInfo.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            {post.category && (
              <Link
                href={`/blog?category=${categorySlug}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {post.category}
              </Link>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50 flex-wrap">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            {post.updatedAt && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Actualizado: {new Date(post.updatedAt).toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground">
          <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-xl font-bold mb-6">Artículos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-all"
                >
                  {related.category && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${getCategoryColorClass(related.category)}`}>
                      {related.category}
                    </span>
                  )}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-foreground transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal Links CTA */}
        <div className="mt-12 rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-lg">¿Listo para elegir tu laptop?</h3>
              <p className="text-sm text-muted-foreground">
                Explora nuestro catálogo o escríbenos por WhatsApp para recibir una recomendación personalizada.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <WhatsAppDropdown
                message="Hola, estoy leyendo el blog y me interesa una laptop. ¿Podrían ayudarme?"
                variant="default"
                className="h-9 px-2.5"
              />
              <Link
                href="/catalogo?categoria=gaming"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <ShoppingBag className="w-4 h-4" />
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </div>

      </div>

      {/* Schemas */}
      <Script id="blog-article-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="blog-breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  );
}
