import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "@/styles/globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import AudioProvider from "@/components/AudioProvider";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import WhatsAppButton from "@/components/WhatsAppButton";

// Display + body faces loaded via next/font. Swap these two imports (and the
// --accent token in globals.css) to fully re-skin the brand.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AdventHQ — Motion that moves the needle",
  description:
    "AdventHQ is a high-end motion design studio crafting ads, 3D & VFX, titles, UGC, marketing and hyper-motion films for brands that want to be remembered.",
  icons: {
    icon: "/favicon-gwr-crop-removebg.png",
    shortcut: "/favicon-gwr-crop-removebg.png",
    apple: "/favicon-gwr-crop-removebg.png",
  },
  openGraph: {
    title: "AdventHQ — Motion Design Studio",
    description:
      "Motion that moves the needle. Ads, product films, 3D & VFX, titles, UGC and hyper-motion.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Runs before first paint: skip the preloader for returning / reduced-
            motion users so it never flashes (and never flashes the hero first). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('advent-preloaded')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-skip-preloader','')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <AudioProvider>
          <SmoothScroll>
            <Preloader />
            <Cursor />
            <Nav />
            <main>{children}</main>
          </SmoothScroll>
        </AudioProvider>
        {/* Floating WhatsApp click-to-chat CTA (global) */}
        <WhatsAppButton />
        {/* Texture overlays sit above content but never intercept pointers */}
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
      </body>
    </html>
  );
}
