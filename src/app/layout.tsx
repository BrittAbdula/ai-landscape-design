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
  title: "AI Landscape Design",
  description: "Transform your outdoor space with AI-powered landscape design",
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
