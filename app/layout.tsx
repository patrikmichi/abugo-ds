import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Load Venn font family for Reservio
const venn = localFont({
  src: [
    {
      path: '../public/fonts/Venn_Rg.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Venn_Md.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Venn_Bd.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-venn',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Design Tokens',
  description: 'Design tokens exported from Figma Tokens Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={venn.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
