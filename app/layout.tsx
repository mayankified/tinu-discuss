import type { Metadata } from "next";
import "./globals.css";
import "../styles/prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { ThemeProvider } from "@/context/Themeprovider";
import { Inter, Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: "TinuDiscuss",
  description:
    "Tinudiscuss is a platform designed for engaging in meaningful discussions on various topics. Connect, share, and grow with a community of thoughtful individuals.",
  icons: {
    icon: "/favicon.ico",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        },
      }}
    >
      <ThemeProvider>
        <html lang="en">
          <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
