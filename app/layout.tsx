import type React from "react";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "800", "700"],
});

export const metadata = {
  title: "TerraNovoa AI - Futuristic GIS Platform",
  description:
    "Revolutionize renewable energy with AI-powered geospatial mapping and insights",
  generator: "Gokul",
  openGraph: {
    title: "TerraNovoa AI - Futuristic GIS Platform",
    description:
      "Revolutionize renewable energy with AI-powered geospatial mapping and insights",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "TerraNovoa AI",
      },
    ],
    type: "website",
    siteName: "TerraNovoa AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraNovoa AI - Futuristic GIS Platform",
    description:
      "Revolutionize renewable energy with AI-powered geospatial mapping and insights",
    images: ["/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
