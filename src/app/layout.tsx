import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quote Builder",
  description: "Fast on-site quotes for finish carpentry and deck work",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-100 text-stone-900">{children}</body>
    </html>
  );
}
