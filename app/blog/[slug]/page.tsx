import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Artículo no encontrado | Morel Technology" };
  }

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
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
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
        url: "https://moreltechnologyrd.com/morel_technology_logo.png",
      },
    },
    datePublished: post.date,
    url: `https://moreltechnologyrd.com/blog/${post.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://moreltechnologyrd.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://moreltechnologyrd.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://moreltechnologyrd.com/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-3">
            {post.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground">
          <MDXRemote source={post.content} />
        </article>

        {/* Back Link */}
        <div className="mt-16 pt-8 border-t border-border/50">
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  );
}
