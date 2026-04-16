import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FMAC Operations Department",
  description: "FMAC Ticketing and Operations System",
  icons: {
    icon: '/fmac-logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
