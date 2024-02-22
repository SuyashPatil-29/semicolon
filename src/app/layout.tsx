import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/utils/themes-provider";
import AllProviders from "@/components/AllProviders";
import { Toaster } from "@/components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

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
  return (
    <html lang="en">
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AllProviders>
              <EdgeStoreProvider>{children}</EdgeStoreProvider>
              <Toaster />
            </AllProviders>
          </ThemeProvider>
      </body>
    </html>
  );
}
