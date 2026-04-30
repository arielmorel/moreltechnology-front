import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Morel Technology - Laptops en República Dominicana",
  description: "Las mejores laptops para estudiar, trabajar y gaming en RD. Equipos nuevos y usados con garantía. Catálogo profesional con atención vía WhatsApp.",
  keywords: ["laptops RD", "laptops en santo domingo", "laptop gamer republica dominicana", "laptops usadas RD", "Morel Technology", "tienda de laptops", "comprar laptop RD"],
  authors: [{ name: "Morel Technology" }],
  creator: "Morel Technology",
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "https://moreltechnology.com.do",
    title: "Morel Technology - Laptops en República Dominicana",
    description: "Las mejores laptops para estudiar, trabajar y gaming en RD. Equipos nuevos y usados con garantía.",
    siteName: "Morel Technology",
  },
};

import { Toaster } from "@/components/ui/sonner";
import { CompareDrawer } from "@/components/compare-drawer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 flex flex-col pt-16">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
          <CompareDrawer />
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}
