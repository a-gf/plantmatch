import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlantMatch — Encuentra tu planta ideal",
  description: "Haz el test, encuentra tu planta ideal y adóptala digitalmente.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
