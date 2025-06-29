import type { Metadata } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat"
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora"
});

export const metadata: Metadata = {
  title: "AI Landscape Design | Smart Garden Planner Powered by AI",
  description: "Transform your garden or backyard with AI. Upload a photo, describe your dream space, and get instant, AI-generated landscape designs for free. No design skills needed.",
  openGraph: {
    title: "AI Landscape Design | Smart AI Garden Planner",
    description: "AI-powered landscape design tool to instantly redesign your outdoor space. Upload a photo and get beautiful, professional garden plans in seconds.",
    url: "https://ailandscapedesign.io/",
    type: "website",
    images: [
      {
        url: "https://ailandscapedesign.io/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "AI Landscape Design Open Graph Cover"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Landscape Design",
    description: "Upload your yard photo and generate stunning AI garden designs. Try it free.",
    images: [
      "https://ailandscapedesign.io/og-cover.jpg"
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${lora.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
