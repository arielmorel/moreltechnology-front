import { ImageResponse } from "next/og";
import { getProducts, resolveBranchId } from "@/lib/api";
import { branches } from "@/lib/data";
import type { Product } from "@/lib/data";
import { CATEGORY_LAPTOPS } from "@/lib/laptops";
import {
  OG_COLORS as C,
  OG_CONTENT_TYPE,
  OG_SIZE,
  fetchImageAsDataUri,
  formatRD,
  loadOgFonts,
  loadOgLogo,
  toOgJpeg,
  truncate,
} from "@/lib/og";

export const alt = "Catálogo de laptops de Morel Technology en República Dominicana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Inventory changes often; regenerate at most every 30 minutes.
export const revalidate = 1800;

const TILE_COUNT = 4;

type Tile = { product: Product; photo: string };

export default async function Image({ params }: { params: Promise<{ branch: string }> }) {
  const { branch } = await params;
  const branchId = resolveBranchId(branch);
  const branchData = branches.find((b) => b.id === branch) ?? branches[0];
  const city = branchData.name.replace("Sucursal ", "");

  const [fonts, logo, { products, total }] = await Promise.all([
    loadOgFonts(),
    loadOgLogo(),
    getProducts(0, 16, CATEGORY_LAPTOPS, branchId),
  ]);

  // Only real laptops (some accessories are miscategorized as "Laptop" in the catalog,
  // but they have no processor), in-stock first; keep tiles whose photo actually loads.
  const hasProcessor = (p: Product) => Boolean(p.processor && p.processor !== "N/A" && p.processor !== "Consultar");
  const candidates = products
    .filter(hasProcessor)
    .sort((a, b) => Number(b.quantity > 0) - Number(a.quantity > 0));
  const tiles: Tile[] = [];
  for (const product of candidates) {
    if (tiles.length >= TILE_COUNT) break;
    const photo = await fetchImageAsDataUri(product.images[0]);
    if (photo) tiles.push({ product, photo });
  }

  const subline = total > 0 ? `${total} laptops disponibles` : "Laptops nuevas y usadas certificadas";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          backgroundImage: "radial-gradient(circle at 0% 0%, rgba(11,108,196,0.10), transparent 50%)",
          fontFamily: "Geist",
          color: C.ink,
          padding: "52px 56px",
        }}
      >
        {/* Left: copy */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: tiles.length ? 40 : 0,
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" width={200} height={80} style={{ width: 200, height: 80, objectFit: "contain", objectPosition: "left" }} />
          ) : (
            <div style={{ fontSize: 34, fontWeight: 800, color: C.brand }}>Morel Technology</div>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "rgba(11,108,196,0.10)",
                  color: C.brand,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 4,
                }}
              >
                {`CATÁLOGO · ${city.toUpperCase()}`}
              </div>
            </div>
            <div style={{ marginTop: 22, fontSize: 64, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
              Laptops en
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: C.brand }}>
              {city}
            </div>
            <div style={{ marginTop: 20, fontSize: 28, fontWeight: 600, color: C.muted }}>{subline}</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {["Garantía", "Financiamiento", "Envío a todo RD"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: 14,
                  border: `2px solid ${C.line}`,
                  fontSize: 20,
                  fontWeight: 600,
                  color: C.ink,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: 2x2 grid of real products */}
        {tiles.length > 0 && (
          <div style={{ width: 500, display: "flex", flexWrap: "wrap", alignContent: "center", gap: 16 }}>
            {tiles.map(({ product, photo }) => (
              <div
                key={product.id}
                style={{
                  width: 242,
                  height: 255,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "#ffffff",
                  border: `2px solid ${C.line}`,
                }}
              >
                <div style={{ width: 242, height: 170, display: "flex", background: C.surface }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" width={242} height={170} style={{ width: 242, height: 170, objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px" }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: C.muted, whiteSpace: "nowrap", overflow: "hidden" }}>
                    {truncate(product.name, 24)}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, color: C.emerald }}>
                    {formatRD(product.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );

  return toOgJpeg(image);
}
