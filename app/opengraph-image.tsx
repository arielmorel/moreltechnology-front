import { ImageResponse } from "next/og";
import { OG_COLORS as C, OG_CONTENT_TYPE, OG_SIZE, loadOgFonts, loadOgLogo, toOgJpeg } from "@/lib/og";

// Site-wide default share image for every route without its own opengraph-image.
export const alt = "Morel Technology - Laptops en República Dominicana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(11,108,196,0.14), transparent 45%), radial-gradient(circle at 100% 100%, rgba(11,108,196,0.10), transparent 45%)",
          fontFamily: "Geist",
          color: C.ink,
          padding: 60,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={340} height={136} style={{ width: 340, height: 136, objectFit: "contain" }} />
        ) : (
          <div style={{ fontSize: 56, fontWeight: 800, color: C.brand }}>Morel Technology</div>
        )}
        <div style={{ marginTop: 36, fontSize: 64, fontWeight: 800, letterSpacing: -2, textAlign: "center" }}>
          Laptops en República Dominicana
        </div>
        <div style={{ marginTop: 16, fontSize: 28, fontWeight: 600, color: C.muted, textAlign: "center" }}>
          Nuevas y usadas certificadas · Santo Domingo y Santiago
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
          {["Garantía", "Financiamiento", "Envío a todo el país"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: 999,
                background: C.brand,
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );

  return toOgJpeg(image);
}
