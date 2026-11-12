import { ImageResponse } from "next/og";
import { getAllOfferProducts } from "@/lib/api";
import { getBlackFridayDeals, getBlackFridayState } from "@/lib/black-friday";
import type { Product } from "@/lib/data";
import { isLaptopCategory } from "@/lib/laptops";
import {
  OG_COLORS as C,
  OG_CONTENT_TYPE,
  OG_SIZE,
  fetchImageAsDataUri,
  formatRD,
  getDiscount,
  loadOgFonts,
  loadOgLogo,
  toOgJpeg,
  truncate,
} from "@/lib/og";

export const alt = "Black Friday 2026 en Morel Technology: laptops en oferta en República Dominicana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Offers and prices change during the campaign; regenerate at most every 30 minutes.
export const revalidate = 1800;

type DealTile = { product: Product; photo: string | null };

export default async function Image() {
  const state = getBlackFridayState();
  const [fonts, logo, products] = await Promise.all([
    loadOgFonts(),
    loadOgLogo(),
    state === "active" ? getAllOfferProducts() : Promise.resolve([]),
  ]);

  const deals = getBlackFridayDeals(products);
  // The headline says "Laptops en oferta", so only laptop discounts count toward "Hasta -X%".
  const laptopDeals = deals.filter((p) => isLaptopCategory(p.category));
  const maxPercent = (laptopDeals.length ? laptopDeals : deals).reduce(
    (max, p) => Math.max(max, getDiscount(p)?.percent ?? 0),
    0
  );
  const tiles: DealTile[] = await Promise.all(
    (laptopDeals.length ? laptopDeals : deals).slice(0, 3).map(async (product) => ({
      product,
      photo: await fetchImageAsDataUri(product.images[0]),
    }))
  );

  const headline =
    state === "active" && maxPercent > 0
      ? `Hasta -${maxPercent}%`
      : state === "upcoming"
        ? "Muy pronto"
        : "Ofertas en laptops";
  const subline =
    state === "active"
      ? deals.length > 0
        ? `${deals.length} ofertas · 1 al 27 de noviembre`
        : "Del 1 al 27 de noviembre"
      : state === "upcoming"
        ? "Ofertas en laptops del 1 al 27 de noviembre"
        : "Explora las ofertas disponibles";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: C.night,
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(220,38,38,0.45), transparent 45%), radial-gradient(circle at 100% 100%, rgba(249,115,22,0.30), transparent 45%)",
          fontFamily: "Geist",
          color: "#ffffff",
          padding: "56px 60px",
        }}
      >
        {/* Left: campaign */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: tiles.length ? 40 : 0,
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "2px solid rgba(248,113,113,0.45)",
                background: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 5,
              }}
            >
              BLACK FRIDAY 2026
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
              Laptops en oferta
            </div>
            <div
              style={{
                fontSize: tiles.length ? 104 : 124,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -4,
                whiteSpace: "nowrap",
                color: "#f87171",
                marginTop: 6,
              }}
            >
              {headline}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 25,
                fontWeight: 600,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {subline}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {logo && (
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 16,
                  background: "#ffffff",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="" width={130} height={52} />
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 19,
                fontWeight: 600,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span>Garantía local · Financiamiento</span>
              <span>Envío a todo el país</span>
            </div>
          </div>
        </div>

        {/* Right: top deals */}
        {tiles.length > 0 && (
          <div style={{ width: 400, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
            {tiles.map(({ product, photo }) => {
              const discount = getDiscount(product);
              return (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: 12,
                    borderRadius: 22,
                    background: "#ffffff",
                    color: C.ink,
                    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
                  }}
                >
                  <div
                    style={{
                      width: 124,
                      height: 132,
                      display: "flex",
                      position: "relative",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: C.surface,
                    }}
                  >
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt=""
                        width={124}
                        height={132}
                        style={{ width: 124, height: 132, objectFit: "cover" }}
                      />
                    )}
                    {discount && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          display: "flex",
                          padding: "3px 9px",
                          borderRadius: 999,
                          background: C.red,
                          color: "#ffffff",
                          fontSize: 17,
                          fontWeight: 800,
                        }}
                      >
                        {`-${discount.percent}%`}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.4 }}>
                      {truncate(product.name, 34)}
                    </div>
                    {discount && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 17,
                          fontWeight: 600,
                          color: C.subtle,
                          textDecoration: "line-through",
                        }}
                      >
                        {formatRD(discount.original)}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        letterSpacing: -1,
                        color: C.emerald,
                      }}
                    >
                      {formatRD(product.price)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );

  return toOgJpeg(image);
}
