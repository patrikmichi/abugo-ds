import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
