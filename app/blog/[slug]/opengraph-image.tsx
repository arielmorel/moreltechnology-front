import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { getExistingPostImage } from "@/lib/blog-cover";
import { getBlogCategoryByName } from "@/lib/data/blog-categories";
import { OG_COLORS as C, OG_CONTENT_TYPE, OG_SIZE, loadOgFonts, loadOgLogo, toOgJpeg, truncate } from "@/lib/og";

// Blog cover: used as the share image and as the thumbnail on blog cards.
export const alt = "Artículo del blog de Morel Technology";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

const MIME_BY_EXT: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

async function loadPostPhoto(image: string | undefined): Promise<string | null> {
  const path = getExistingPostImage(image);
  const mime = path && MIME_BY_EXT[path.split(".").pop()?.toLowerCase() ?? ""];
  if (!path || !mime) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", path));
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const [fonts, logo, photo] = await Promise.all([loadOgFonts(), loadOgLogo(), loadPostPhoto(post?.image)]);

  const category = post ? getBlogCategoryByName(post.category) : undefined;
  const accent = category?.accent ?? C.brand;
  const categoryLabel = category?.name ?? post?.category ?? "Blog";
  const title = truncate(post?.title ?? "Blog de Morel Technology", 96);
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  const tags = (post?.tags ?? []).filter((t) => t.length <= 22).slice(0, 3);

  // With a real photo: full-bleed photo under a dark gradient, white text.
  // Without one: light branded card tinted with the category's accent color.
  const onPhoto = Boolean(photo);
  const ink = onPhoto ? "#ffffff" : C.ink;
  const muted = onPhoto ? "rgba(255,255,255,0.8)" : C.muted;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Geist",
          color: ink,
          background: onPhoto ? C.night : "#ffffff",
          backgroundImage: onPhoto
            ? undefined
            : `radial-gradient(circle at 100% 0%, ${accent}38, transparent 50%), radial-gradient(circle at 0% 100%, ${accent}1f, transparent 45%)`,
        }}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{ position: "absolute", inset: 0, width: OG_SIZE.width, height: OG_SIZE.height, objectFit: "cover" }}
          />
        )}
        {photo && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              backgroundImage: "linear-gradient(90deg, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.75) 55%, rgba(9,9,11,0.35) 100%)",
            }}
          />
        )}

        {/* Decorative accent rings (no photo) */}
        {!onPhoto && (
          <div
            style={{
              position: "absolute",
              right: -150,
              top: -150,
              width: 520,
              height: 520,
              borderRadius: 999,
              border: `56px solid ${accent}`,
              opacity: 0.14,
              display: "flex",
            }}
          />
        )}
        {!onPhoto && (
          <div
            style={{
              position: "absolute",
              right: 70,
              bottom: 120,
              width: 150,
              height: 150,
              borderRadius: 999,
              background: accent,
              opacity: 0.12,
              display: "flex",
            }}
          />
        )}

        {/* Left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: accent, display: "flex" }} />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 80px 56px 90px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  background: accent,
                  color: "#ffffff",
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {categoryLabel}
              </div>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: muted }}>Blog</div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 40,
                maxWidth: 960,
                fontSize: titleSize,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -1.5,
              }}
            >
              {title}
            </div>

            {tags.length > 0 && (
              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                {tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: "flex",
                      padding: "8px 18px",
                      borderRadius: 999,
                      fontSize: 22,
                      fontWeight: 600,
                      color: onPhoto ? "#ffffff" : accent,
                      background: onPhoto ? "rgba(255,255,255,0.14)" : `${accent}14`,
                      border: `2px solid ${onPhoto ? "rgba(255,255,255,0.25)" : `${accent}40`}`,
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {logo && !onPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" width={190} height={76} style={{ width: 190, height: 76, objectFit: "contain" }} />
            ) : (
              <div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>Morel Technology</div>
            )}
            <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: muted }}>moreltechnologyrd.com/blog</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );

  return toOgJpeg(image);
}
