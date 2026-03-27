import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedMate — Documente consultas no eSUS mais rápido",
  description:
    "Prontuário eletrônico para médicos de família. Consulta estruturada, cálculos automáticos e texto pronto para colar no eSUS PEC.",
  openGraph: {
    title: "MedMate — Documente consultas no eSUS mais rápido",
    description:
      "Estrutura clínica, cálculos automáticos e texto pronto para colar no eSUS PEC. Menos digitação, mais tempo com o paciente.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
