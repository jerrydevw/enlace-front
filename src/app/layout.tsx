import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enlace — Transmissao ao vivo",
  description: "Para quem nao pode estar, mas nao quer perder.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
