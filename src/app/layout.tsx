import type { Metadata } from "next";
import AuthProvider from "@/lib/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaBot Pro - 인스타그램 자동화 플랫폼",
  description:
    "팔로우, 좋아요, 댓글을 AI가 자동으로 관리합니다. 인스타그램 성장을 자동화하세요.",
  keywords: [
    "인스타그램 자동화",
    "인스타봇",
    "팔로워 늘리기",
    "좋아요 자동",
    "인스타그램 마케팅",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
