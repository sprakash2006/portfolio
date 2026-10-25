import type { Metadata } from "next";
import { Inter, Outfit, Press_Start_2P, JetBrains_Mono } from "next/font/google";
import { DEFAULT_THEME, themeScript } from "@/lib/themes";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const pixel = Press_Start_2P({ variable: "--font-pixel", weight: "400", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

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
      className={`${DEFAULT_THEME} ${inter.variable} ${outfit.variable} ${pixel.variable} ${mono.variable} antialiased`}
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
      </body>
    </html>
  );
}
