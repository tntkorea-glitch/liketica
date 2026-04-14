"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navItems = [
  { label: "기능", href: "#features" },
  { label: "요금제", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "고객지원", href: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#fff7ee]/80 backdrop-blur-xl border-b border-[#2a0f2d]/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl insta-gradient flex items-center justify-center shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2.2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#2a0f2d]">
              InstaBot <span className="insta-gradient-text">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#5a3b52] hover:text-[#d62976] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-[#5a3b52] hover:text-[#2a0f2d] transition-colors px-4 py-2"
            >
              로그인
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white insta-gradient px-5 py-2.5 rounded-full transition-all shadow-md shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-0.5"
            >
              무료 시작
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#2a0f2d] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴 열기"
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#fff7ee]/95 backdrop-blur-xl border-t border-[#2a0f2d]/10">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#5a3b52] hover:text-[#d62976] hover:bg-white/60 rounded-xl transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#2a0f2d]/10 mt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="block text-center text-sm font-medium text-[#5a3b52] hover:text-[#2a0f2d] py-2.5 rounded-xl transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/dashboard"
                className="block text-center text-sm font-semibold text-white insta-gradient py-2.5 rounded-full shadow-md shadow-pink-500/30"
              >
                무료 시작
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
