import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const SITE_URL = "https://obutech.com.ua";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "OBU TECH — Виїзна комп'ютерна допомога в Обухові",
  description:
    "Діагностика, чистка, переустановка Windows, апгрейд та ремонт ПК з виїздом додому в Обухові та найближчих районах. Ціна узгоджується до початку робіt. Гарантія на роботи.",
  keywords: [
    "комп'ютерна допомога Обухів",
    "ремонт ПК Обухів",
    "виїзд комп'ютерний майстер",
    "переустановка Windows Обухів",
    "чистка ПК від пилу",
    "OBU TECH",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "OBU TECH",
    title: "OBU TECH — Виїзна комп'ютерна допомога в Обухові",
    description:
      "Швидка діагностика, прозора ціна до початку робіт, гарантія. Обухів і найближчі райони.",
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "OBU TECH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OBU TECH — Виїзна комп'ютерна допомога в Обухові",
    description: "Діагностика, ремонт та апгрейд ПК з виїздом додому в Обухові.",
    images: ["/og-cover.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-base-950 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
