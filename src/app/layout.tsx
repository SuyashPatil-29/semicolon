import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/utils/themes-provider";
import AllProviders from "@/components/AllProviders";
import { Toaster } from "@/components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { GeistSans } from "geist/font/sans";
import { unstable_noStore as noStore } from "next/cache";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Semicolon",
  description: "Share and manage files with your class with ease",
  metadataBase: new URL("https://i.postimg.cc/kXB4K9gN"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  openGraph: {
    images: "/opengraph-image.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AllProviders>
            <EdgeStoreProvider>
              {children}
            </EdgeStoreProvider>
            <Analytics />
            <Toaster />
          </AllProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
