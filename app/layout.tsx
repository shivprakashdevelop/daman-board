import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best in Daman — Get seen in Daman.",
  description: "Fixed-price local visibility for Daman businesses, creators, events, services, and community projects.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Best in Daman — Get seen in Daman.",
    description: "Fixed-price local visibility for Daman businesses, creators, events, services, and community projects.",
    type: "website",
    images: [{ url: "/og.png", width: 1744, height: 912, alt: "Get seen in Daman. Fixed-price local visibility." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best in Daman — Get seen in Daman.",
    description: "Fixed-price local visibility for Daman businesses, creators, events, services, and community projects.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
