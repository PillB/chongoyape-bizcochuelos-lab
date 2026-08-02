import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chongoyape Bizcochuelos Reverse-Engineering Lab",
  description:
    "An evidence-gated, Red–Green–Refactor reverse-engineering lab for the Bizcochuelos Valera of Chongoyape, Lambayeque, Peru. Multi-round research, ingredient & technique ledgers, a foam-only core recipe, and an adversarial challenge-and-parsimony verdict.",
  keywords: [
    "bizcochuelos",
    "Valera",
    "Chongoyape",
    "Lambayeque",
    "Peru",
    "reverse engineering",
    "food science",
    "sponge cake",
    "recipe lab",
  ],
  authors: [{ name: "Chongoyape Reverse-Engineering Lab" }],
  openGraph: {
    title: "Chongoyape Bizcochuelos Reverse-Engineering Lab",
    description:
      "Evidence-gated reconstruction of the Bizcochuelos Valera — research, ledgers, foam-only core recipe, and adversarial validation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
