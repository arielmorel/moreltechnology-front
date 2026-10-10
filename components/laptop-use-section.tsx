import Link from "next/link";
import { getProducts } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import type { Product } from "@/lib/data";
import { CATEGORY_LAPTOPS, isLaptopCategory, type LaptopUse } from "@/lib/laptops";
import { ProductCard } from "@/components/product-card";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { ArrowRight, Laptop } from "lucide-react";

const SITE_URL = "https://moreltechnologyrd.com";
const PAGE_SIZE = 4;

interface LaptopUseSectionProps {
  use: LaptopUse;
}

export async function LaptopUseSection({ use }: LaptopUseSectionProps) {
  const queryTags = use.productTags ?? [use.tag];
  const results = await Promise.all(
    queryTags.map((tag) => getProducts(0, PAGE_SIZE, CATEGORY_LAPTOPS, undefined, tag))
  );

  const seen = new Set<string>();
  const laptops: Product[] = [];
  for (const { products } of results) {
    for (const product of products) {
      if (isLaptopCategory(product.category) && !seen.has(product.id)) {
        seen.add(product.id);
        laptops.push(product);
      }
    }
  }
  const slicedLaptops = laptops.slice(0, PAGE_SIZE);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: use.title,
    numberOfItems: slicedLaptops.length,
    itemListElement: slicedLaptops.map((product, index) => {
      const lowestOfferPrice = product.prices.length > 0
        ? Math.min(...product.prices.map(p => (p.offerPrice && p.offerPrice > 0 ? p.offerPrice : p.priceOut)))
        : product.price;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.images[0],
          description: product.description,
          brand: { "@type": "Brand", name: product.brand },
          sku: product.id,
          offers: {
            "@type": "Offer",
            priceCurrency: product.prices[0]?.currency || "DOP",
            price: lowestOfferPrice,
            availability: product.quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${SITE_URL}${productUrl(product.slug)}`,
          },
        },
      };
    }),
  };

  return (
    <section id={use.id} className="scroll-mt-24 border-t border-border/50 py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Laptop className="w-3.5 h-3.5" />
              {use.name}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">{use.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{use.seo}</p>
          </div>
          <Link
            href={use.href}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Ver todas las laptops {use.name.toLowerCase()}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {slicedLaptops.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {slicedLaptops.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-card rounded-2xl border border-border/60">
            <h3 className="text-lg font-bold mb-1">
              Consulta disponibilidad de laptops {use.name.toLowerCase()}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Tenemos más modelos disponibles; escríbenos por WhatsApp para confirmar el mejor equipo para ti.
            </p>
            <WhatsAppDropdown
              message={`Hola, busco una laptop ${use.tag}. ¿Qué tienen disponible?`}
              className="h-12 px-8 rounded-xl text-base font-bold"
            >
              Consultar por WhatsApp
            </WhatsAppDropdown>
          </div>
        )}
      </div>

      <script
        id={`laptops-${use.id}-itemlist-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </section>
  );
}