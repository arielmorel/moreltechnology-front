import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getAllPosts, getPostsByCategory } from "@/lib/blog";
import { blogCategories, getBlogCategoryBySlug } from "@/lib/data/blog-categories";
import { BlogCard } from "@/components/blog-card";
import { ArrowLeft, BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);

  if (!category) {
    return { title: "Categoría no encontrada | Morel Technology Blog" };
  }

  return {
    title: `${category.name} - Blog | Morel Technology República Dominicana`,
    description: category.description,
    alternates: {
      canonical: `/blog?category=${slug}`,
    },
    openGraph: {
      title: `${category.name} - Blog | Morel Technology`,
      description: category.description,
      type: "website",
      locale: "es_DO",
      siteName: "Morel Technology",
    },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://moreltechnologyrd.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://moreltechnologyrd.com/blog" },
      { "@type": "ListItem", position: 3, name: category.name, item: `https://moreltechnologyrd.com/blog?category=${slug}` },
    ],
  };

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Blog / {category.name}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {category.name}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No hay artículos en esta categoría</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Estamos preparando contenido para {category.name}. Vuelve pronto.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </div>

      </div>

      <Script id="blog-category-breadcrumb" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  );
}
