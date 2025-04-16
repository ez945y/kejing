import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "可京室內裝修 | 專業室內設計與裝修服務",
  description: "以人因做設計的基礎，運用節能和智能觀念，配合健康和安全建材，為您創造美好、幸福、健康的居家環境。",
  openGraph: {
    title: "可京室內裝修 | 專業室內設計與裝修服務",
    description: "以人因做設計的基礎，運用節能和智能觀念，配合健康和安全建材，為您創造美好、幸福、健康的居家環境。",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
