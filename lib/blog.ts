import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  category: string;
  image: string;
  tags: string[];
  relatedProducts?: string[];
  content: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  category: string;
  image: string;
  tags: string[];
  relatedProducts?: string[];
}

function parsePost(filePath: string, file: string): BlogPostSummary {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    slug: file.replace(".mdx", ""),
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    updatedAt: data.updatedAt || undefined,
    author: data.author || "Morel Technology",
    category: data.category || "",
    image: data.image || "",
    tags: data.tags || [],
    relatedProducts: data.relatedProducts || [],
  };
}

export function getAllPosts(): BlogPostSummary[] {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const filePath = path.join(blogDir, file);
    return parsePost(filePath, file);
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(categorySlug: string): BlogPostSummary[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => {
    const normalizedCategory = post.category
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return normalizedCategory === categorySlug;
  });
}

export function getPostsByTag(tag: string): BlogPostSummary[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostSummary[] {
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((p) => p.slug === slug);
  if (!currentPost) return [];

  const scored = allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === currentPost.category) score += 3;
      const sharedTags = p.tags.filter((t) => currentPost.tags.includes(t));
      score += sharedTags.length;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    updatedAt: data.updatedAt || undefined,
    author: data.author || "Morel Technology",
    category: data.category || "",
    image: data.image || "",
    tags: data.tags || [],
    relatedProducts: data.relatedProducts || [],
    content,
  };
}

export function getAllCategorySlugs(): string[] {
  const posts = getAllPosts();
  const slugs = new Set<string>();
  posts.forEach((post) => {
    const slug = post.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    slugs.add(slug);
  });
  return Array.from(slugs);
}
