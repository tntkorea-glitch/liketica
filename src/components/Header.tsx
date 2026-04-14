"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { label: "🎯 전체", href: "#", active: true },
  { label: "인스타 팔로워", href: "#followers" },
  { label: "인스타 좋아요", href: "#likes" },
  { label: "AI 댓글", href: "#comments" },
  { label: "자동화 구독", href: "#plans" },
  { label: "스케줄링", href: "#schedule" },
  { label: "고객센터", href: "#support" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top utility bar */}
      <div className="border-b border-slate-200 bg-slate-50 text-xs">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-slate-600">
          <p className="hidden sm:block">365일 운영 · 결제 후 즉시 자동화 시작 🔥</p>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:text-slate-900">로그인</Link>
            <span className="text-slate-300">|</span>
            <Link href="/signup" className="hover:text-slate-900">회원가입</Link>
            <span className="text-slate-300">|</span>
            <Link href="/dashboard" className="hover:text-slate-900">주문조회</Link>
            <span className="text-slate-300">|</span>
            <Link href="#support" className="hover:text-slate-900">고객센터</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b-2 border-slate-900 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-md">B</div>
            <span className="text-lg sm:text-xl font-black tracking-tight">인스타봇 프로</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <input
              placeholder="어떤 서비스를 찾으세요? (예: 팔로워, 좋아요, 댓글)"
              className="flex-1 border-2 border-orange-500 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            <button className="bg-orange-500 text-white px-5 rounded-r-lg text-sm font-bold hover:bg-orange-600 transition">검색</button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="relative" aria-label="장바구니">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
            </Link>
            <button
              className="md:hidden p-2 text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="메뉴"
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex">
            <input placeholder="검색" className="flex-1 border-2 border-orange-500 rounded-l-lg px-3 py-2 text-sm focus:outline-none" />
            <button className="bg-orange-500 text-white px-4 rounded-r-lg text-sm font-bold">검색</button>
          </div>
        </div>
      </header>

      {/* Category nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={`whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-2 transition ${
                  c.active ? "border-orange-500 text-orange-600" : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-4 py-3 space-y-1">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">로그인</Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">회원가입</Link>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">주문조회</Link>
            <Link href="#support" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">고객센터</Link>
          </div>
        </div>
      )}
    </>
  );
}
