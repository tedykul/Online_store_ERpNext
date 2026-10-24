import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SayurBox — Toko Online Sayur & Buah Segar",
  description: "Belanja sayuran dan buah segar langsung dari petani lokal. Antar cepat, kualitas terjamin. Terintegrasi dengan ERPNext.",
  keywords: ["grocery", "sayur", "buah", "online", "segar", "ERPNext", "toko online"],
  authors: [{ name: "SayurBox" }],
  openGraph: {
    title: "SayurBox — Toko Online Sayur & Buah Segar",
    description: "Belanja sayuran dan buah segar langsung dari petani lokal.",
    siteName: "SayurBox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SayurBox — Toko Online Sayur & Buah Segar",
    description: "Belanja sayuran dan buah segar langsung dari petani lokal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
