import Form from "next/form";
import Link from "next/link";
import { Search, X } from "lucide-react";

interface BlogSearchProps {
  query?: string;
  category?: string;
}

export function BlogSearch({ query, category }: BlogSearchProps) {
  const clearHref = category ? `/blog?category=${category}` : "/blog";

  return (
    <Form action="/blog" role="search" className="relative w-full max-w-xl">
      {category && <input type="hidden" name="category" value={category} />}
      <label htmlFor="blog-search" className="sr-only">
        Buscar en el blog
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        id="blog-search"
        // key resets the uncontrolled input when the query changes via navigation (e.g. "Limpiar").
        key={query ?? ""}
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Buscar artículos: GTA 6, WoW, RTX 4060, Zelda..."
        autoComplete="off"
        className="h-12 w-full rounded-full border border-border/60 bg-background pl-11 pr-24 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-ring/20 [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {query && (
          <Link
            href={clearHref}
            aria-label="Limpiar búsqueda"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </Link>
        )}
        <button
          type="submit"
          className="h-9 rounded-full bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
        >
          Buscar
        </button>
      </div>
    </Form>
  );
}
