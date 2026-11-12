import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/api";
import { isBlackFridayActive } from "@/lib/black-friday";
import {
  OG_COLORS as C,
  OG_CONTENT_TYPE,
  OG_SIZE,
  fetchImageAsDataUri,
  formatRD,
  getDiscount,
  loadOgFonts,
  loadOgLogo,
  productSpecs,
  toOgJpeg,
  truncate,
} from "@/lib/og";

export const alt = "Laptop en Morel Technology, República Dominicana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Prices change during campaigns; regenerate at most every 30 minutes.
export const revalidate = 1800;

const PHOTO_WIDTH = 540;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, fonts, logo] = await Promise.all([
    getProductBySlug(slug),
    loadOgFonts(),
    loadOgLogo(),
  ]);
  const photo = product ? await fetchImageAsDataUri(product.images[0]) : null;

  const discount = product ? getDiscount(product) : null;
  const specs = product ? productSpecs(product) : [];
  const showBlackFriday = Boolean(discount) && isBlackFridayActive();
  const name = product ? truncate(product.name, 58) : "Laptops con garantía en República Dominicana";
  const nameSize = name.length > 40 ? 46 : 54;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          fontFamily: "Geist",
          color: C.ink,
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: PHOTO_WIDTH,
            height: "100%",
            display: "flex",
            position: "relative",
            background: C.surface,
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              width={PHOTO_WIDTH}
              height={OG_SIZE.height}
              style={{ width: PHOTO_WIDTH, height: OG_SIZE.height, objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" width={300} height={121} />
              )}
            </div>
          )}

          {discount && (
            <div
              style={{
                position: "absolute",
                top: 32,
                left: 32,
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                background: C.red,
                color: "#ffffff",
                fontSize: 34,
                fontWeight: 800,
                boxShadow: "0 10px 30px rgba(239,68,68,0.35)",
              }}
            >
              {`-${discount.percent}%`}
            </div>
          )}
        </div>

        {/* Details */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 52px 40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Without a photo the left panel already shows the logo. */}
            {logo && photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" width={170} height={68} />
            ) : !logo ? (
              <div style={{ fontSize: 26, fontWeight: 800, color: C.brand }}>Morel Technology</div>
            ) : (
              <div style={{ display: "flex" }} />
            )}
            {showBlackFriday && (
              <div
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: C.night,
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 3,
                }}
              >
                BLACK FRIDAY
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {product && (
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: C.brand,
                  textTransform: "uppercase",
                }}
              >
                {`${product.brand} · ${product.condition}`}
              </div>
            )}
            <div
              style={{
                marginTop: 10,
                fontSize: nameSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              {name}
            </div>
            {specs.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                {specs.map((spec) => (
                  <div
                    key={spec}
                    style={{
                      display: "flex",
                      padding: "7px 14px",
                      borderRadius: 999,
                      background: C.surface,
                      border: `1px solid ${C.line}`,
                      fontSize: 19,
                      fontWeight: 600,
                      color: C.muted,
                    }}
                  >
                    {spec}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {product && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {discount && (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 600,
                        color: C.subtle,
                        textDecoration: "line-through",
                      }}
                    >
                      {formatRD(discount.original)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        padding: "5px 12px",
                        borderRadius: 10,
                        background: "rgba(239,68,68,0.1)",
                        color: C.redDark,
                        fontSize: 20,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`Ahorras ${formatRD(discount.savings)}`}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    fontSize: 68,
                    fontWeight: 800,
                    letterSpacing: -2,
                    lineHeight: 1,
                    color: discount ? C.emerald : C.ink,
                  }}
                >
                  {formatRD(product.price)}
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                marginTop: 22,
                paddingTop: 18,
                borderTop: `1px solid ${C.line}`,
                fontSize: 19,
                fontWeight: 600,
                color: C.muted,
              }}
            >
              Garantía local · Financiamiento · Envío a todo RD
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );

  return toOgJpeg(image);
}
