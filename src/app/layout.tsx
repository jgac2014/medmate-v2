import type { Metadata } from "next";
import { Newsreader, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    <html
      lang="pt-BR"
      className={`${publicSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
