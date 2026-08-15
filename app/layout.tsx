import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ClientProviders } from "@/components/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://moreltechnologyrd.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Morel Technology - Laptops en República Dominicana",
  description: "Laptops nuevas y usadas con garantía en RD. Estudio, trabajo y gaming con atención por WhatsApp.",
  keywords: ["laptops RD", "laptops en santo domingo", "laptop gamer republica dominicana", "laptops usadas RD", "Morel Technology", "tienda de laptops", "comprar laptop RD"],
  authors: [{ name: "Morel Technology" }],
  creator: "Morel Technology",
  icons: {
    icon: [
      { media: "(max-width: 768px)", url: "/favicon-16.png", sizes: "16x16" },
      { url: "/favicon-32.png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      "es": "/",
      "es-DO": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: SITE_URL,
    title: "Morel Technology - Laptops en República Dominicana",
    description: "Laptops nuevas y usadas con garantía en RD. Estudio, trabajo y gaming con atención por WhatsApp.",
    siteName: "Morel Technology",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Morel Technology - Laptops en República Dominicana" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morel Technology - Laptops en República Dominicana",
    description: "Laptops nuevas y usadas con garantía en RD. Estudio, trabajo y gaming con atención por WhatsApp.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://minio.sm.novuswise.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Preload hero image for LCP */}
        <link rel="preload" as="image" href="/laptop.jpeg" fetchPriority="high" />

        {/* Preload logo */}
        <link rel="preload" as="image" href="/morel_technology_logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 flex flex-col pt-0">
            {children}
          </main>
          <Footer />
          <ClientProviders />
        </ThemeProvider>
      </body>
    </html>
  );
}
