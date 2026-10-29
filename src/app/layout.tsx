import type { Metadata } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans, Press_Start_2P, JetBrains_Mono, Sacramento } from "next/font/google";
import { DEFAULT_THEME, themeScript } from "@/lib/themes";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
// Experience job titles and bullet points
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const pixel = Press_Start_2P({ variable: "--font-pixel", weight: "400", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
// Hero signature; "block" avoids drawing the signature in a fallback font first
const signature = Sacramento({ variable: "--font-signature", weight: "400", subsets: ["latin"], display: "block" });

export const metadata: Metadata = {
  title: "Prakash Swami — Portfolio",
  description: "Prakash Swami — developer portfolio: experience, skills, projects and contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${DEFAULT_THEME} ${inter.variable} ${outfit.variable} ${jakarta.variable} ${pixel.variable} ${mono.variable} ${signature.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before paint so there is no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <Background />
        <Navbar />
        {children}
        <ScrollToTop />
        <SmoothScroll />
      </body>
    </html>
  );
}
