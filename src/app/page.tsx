"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── Data ─── */
const bestProducts = [
  {
    badge: "BEST",
    badgeColor: "bg-rose-500",
    emoji: "🔥",
    tag: "자동화 구독 · Pro",
    title: "InstaBot Pro 월 구독",
    desc: "3계정 · 무제한 좋아요 · AI 댓글",
    price: "49,000",
    original: "79,000",
    rating: "4.9",
    reviews: 2847,
    sold: "3,421",
    href: "/dashboard",
  },
  {
    badge: "HOT",
    badgeColor: "bg-orange-500",
    emoji: "💥",
    tag: "자동화 구독 · Starter",
    title: "InstaBot Starter 월 구독",
    desc: "1계정 · 일 500 좋아요 · 자동 팔로우",
    price: "19,000",
    original: "29,000",
    rating: "4.8",
    reviews: 1204,
    sold: "1,892",
    href: "/dashboard",
  },
  {
    badge: "NEW",
    badgeColor: "bg-blue-500",
    emoji: "✨",
    tag: "자동화 구독 · Business",
    title: "InstaBot Business",
    desc: "10계정 · API · 전담 매니저",
    price: "99,000",
    original: "149,000",
    rating: "5.0",
    reviews: 428,
    sold: "512",
    href: "/dashboard",
  },
  {
    badge: "추천",
    badgeColor: "bg-violet-500",
    emoji: "⭐",
    tag: "무료 체험",
    title: "Basic 무료 플랜",
    desc: "1계정 · 일 50 좋아요 · 카드등록 없이",
    price: "0",
    original: "",
    rating: "4.7",
    reviews: 891,
    sold: "1,123",
    href: "/dashboard",
  },
];

const featureProducts = [
  { emoji: "👥", tag: "팔로우", title: "자동 팔로우 엔진", desc: "해시태그 기반 스마트 타겟팅", price: "Pro 포함" },
  { emoji: "❤️", tag: "좋아요", title: "자동 좋아요", desc: "일일 한도 자동 분산", price: "Pro 포함" },
  { emoji: "💬", tag: "AI 댓글", title: "AI 자연 댓글", desc: "문맥 이해형 댓글 자동 생성", price: "Pro 포함" },
  { emoji: "⏰", tag: "스케줄", title: "시간대 스케줄링", desc: "랜덤 딜레이로 안전하게", price: "Pro 포함" },
  { emoji: "📊", tag: "분석", title: "실시간 분석", desc: "팔로워·인게이지먼트 대시보드", price: "Pro 포함" },
  { emoji: "🔒", tag: "안전", title: "차단 방지 엔진", desc: "인간 패턴 시뮬레이션", price: "Pro 포함" },
];

const blogPosts = [
  { cat: "성장 팁", title: "인스타 팔로워 3배 늘린 7가지 방법 👋", date: "2026.04.10", emoji: "📈" },
  { cat: "안전 가이드", title: "자동화 써도 계정 안 막히는 원칙 5가지", date: "2026.04.08", emoji: "🛡️" },
  { cat: "고객 후기", title: "월 1000→15000 팔로워, 3개월 만에 성공한 썰", date: "2026.04.05", emoji: "💬" },
];

const reviews = [
  { name: "mi***", rating: 5, text: "3주 만에 팔로워 2천 명 늘었어요. 진짜 한국인 팔로워라 만족합니다!", product: "Pro 월 구독" },
  { name: "ju***", rating: 5, text: "AI 댓글이 진짜 사람이 쓴 것 같아요. 신기해요 ㅋㅋ", product: "Pro 월 구독" },
  { name: "so***", rating: 5, text: "계정 안 막히고 잘 돌아갑니다. 상담도 친절해요!", product: "Starter" },
  { name: "ha***", rating: 4, text: "가격 대비 효과 굿. 체험판부터 써봤는데 바로 결제했음", product: "Pro 월 구독" },
];

const faqs = [
  { q: "계정이 차단될 위험은 없나요?", a: "인간과 유사한 활동 패턴, 랜덤 딜레이, 일일 안전 한도를 적용합니다. 현재까지 99.98% 안전률 유지 중입니다." },
  { q: "환불이 가능한가요?", a: "모든 유료 플랜은 7일 이내 100% 환불 보장. 문의 주시면 영업일 1일 이내 처리됩니다." },
  { q: "어떻게 시작하나요?", a: "상품 구매 → 대시보드에서 인스타그램 계정 연결 → 해시태그 입력 → 자동 시작. 평균 5분 소요." },
  { q: "여러 계정을 쓸 수 있나요?", a: "Pro는 3계정, Business는 10계정까지. 계정 간 완전 격리된 세션으로 안전하게 운영." },
];

/* ─── Product Card ─── */
function ProductCard({ p }: { p: typeof bestProducts[number] }) {
  return (
    <Link href={p.href} className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all bg-white">
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-7xl">
        <span className="group-hover:scale-110 transition-transform">{p.emoji}</span>
        <span className={`absolute top-2 left-2 ${p.badgeColor} text-white text-[10px] font-black px-2 py-1 rounded`}>{p.badge}</span>
        <button className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition" aria-label="장바구니 담기">
          🛒
        </button>
      </div>
      <div className="p-3">
        <p className="text-[10px] text-slate-400 mb-1">{p.tag}</p>
        <p className="text-sm font-bold leading-tight mb-1 line-clamp-1">{p.title}</p>
        <p className="text-[11px] text-slate-500 mb-2 line-clamp-1">{p.desc}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-black text-rose-600">
            {p.price === "0" ? "무료" : `₩${p.price}`}
          </span>
          {p.original && <span className="text-xs text-slate-400 line-through">₩{p.original}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="text-amber-500">★</span>
          <span className="font-bold text-slate-700">{p.rating}</span>
          <span>({p.reviews.toLocaleString()})</span>
          <span className="ml-auto">판매 {p.sold}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── FAQ ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50">
        <span className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-orange-500 text-white text-xs font-black flex items-center justify-center shrink-0">Q</span>
          <span className="text-sm font-semibold">{q}</span>
        </span>
        <span className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0">
          <div className="flex gap-3 pl-0">
            <span className="w-6 h-6 rounded bg-slate-200 text-slate-600 text-xs font-black flex items-center justify-center shrink-0">A</span>
            <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        {/* Promo banner */}
        <section className="max-w-6xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white p-6 sm:p-10 relative overflow-hidden">
              <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">🔥 이번 주 특가</p>
              <h1 className="text-3xl sm:text-5xl font-black leading-[1.1] mb-3">
                첫 달 50% 할인<br />
                <span className="text-yellow-200">+ 7일 무료 체험</span>
              </h1>
              <p className="text-sm opacity-90 mb-5 max-w-md">신규 회원 한정 · 신용카드 등록 없이 바로 시작</p>
              <Link href="/dashboard" className="inline-block bg-white text-rose-600 font-black px-6 py-3 rounded-full text-sm hover:bg-yellow-50 transition shadow-lg">
                지금 시작하기 →
              </Link>
              <div className="absolute -right-8 -bottom-10 text-[180px] opacity-20 leading-none">😎</div>
            </div>
            <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-yellow-300 mb-2">👋 안전 가이드</p>
                <h3 className="text-xl font-black leading-tight">차단 없이<br />자동화하는 법</h3>
                <p className="text-xs text-slate-400 mt-2">차단 방지 원칙 5가지 공개</p>
              </div>
              <Link href="#support" className="text-sm text-yellow-300 font-bold hover:underline self-start">자세히 보기 →</Link>
            </div>
          </div>
        </section>

        {/* Best products */}
        <section id="plans" className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">😎 베스트 서비스</h2>
              <p className="text-sm text-slate-500 mt-1">가장 많이 선택하는 구독 상품</p>
            </div>
            <Link href="#" className="text-sm text-slate-500 hover:text-slate-900">전체보기 →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bestProducts.map((p) => <ProductCard key={p.title} p={p} />)}
          </div>
        </section>

        {/* Trust badges */}
        <section className="max-w-6xl mx-auto px-4 py-8 border-y border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🔒", t: "안전 결제", s: "토스·카카오페이·카드" },
              { icon: "⚡", t: "즉시 시작", s: "결제 후 1분 내 작동" },
              { icon: "💬", t: "24시간 상담", s: "카카오톡 채널" },
              { icon: "↩️", t: "100% 환불", s: "7일 이내 무조건" },
            ].map((b) => (
              <div key={b.t}>
                <p className="text-3xl mb-1">{b.icon}</p>
                <p className="font-bold text-sm">{b.t}</p>
                <p className="text-xs text-slate-500">{b.s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature products (Pro에 포함) */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black">⭐ Pro 구독 포함 기능</h2>
            <p className="text-sm text-slate-500 mt-1">6가지 엔진이 동시에 작동합니다</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {featureProducts.map((f) => (
              <div key={f.title} className="border border-slate-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-sm transition">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-2xl shrink-0">{f.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-orange-600 font-bold mb-0.5">{f.tag}</p>
                    <p className="font-bold text-sm mb-1">{f.title}</p>
                    <p className="text-xs text-slate-500 leading-snug">{f.desc}</p>
                    <p className="text-xs text-rose-600 font-bold mt-2">{f.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-slate-50 py-12 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black">💬 실제 구매자 후기</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-amber-500 text-lg">★★★★★</span>
                <span className="text-sm font-bold">4.9 / 5</span>
                <span className="text-xs text-slate-500">· 5,370건 후기</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">{r.name}</span>
                    <span className="text-amber-500 text-xs">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 min-h-[3rem]">{r.text}</p>
                  <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-2">{r.product}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black">👋 블로그 추천</h2>
            <Link href="#" className="text-sm text-slate-500 hover:text-slate-900">전체보기 →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogPosts.map((b) => (
              <Link key={b.title} href="#" className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition">
                <div className="aspect-video bg-gradient-to-br from-orange-100 via-rose-100 to-pink-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {b.emoji}
                </div>
                <div className="p-4">
                  <p className="text-xs text-orange-600 font-bold mb-1">{b.cat}</p>
                  <p className="font-bold leading-tight mb-2 group-hover:text-orange-600 transition">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-slate-50 py-12 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">🤔 자주 묻는 질문</h2>
            <div className="space-y-2">
              {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white p-8 sm:p-12 text-center relative overflow-hidden">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-3">🎁 신규 회원 전용</p>
            <h2 className="text-2xl sm:text-4xl font-black mb-3">지금 시작하면 7일 무료</h2>
            <p className="text-sm sm:text-base opacity-90 mb-6">신용카드 등록 없이 · 30초 만에 가입</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard" className="bg-white text-rose-600 font-black px-8 py-3.5 rounded-full text-sm hover:bg-yellow-50 transition shadow-lg">
                무료로 시작하기 →
              </Link>
              <a href="https://pf.kakao.com/_instabotpro" target="_blank" rel="noopener noreferrer" className="bg-yellow-300 text-yellow-900 font-black px-8 py-3.5 rounded-full text-sm hover:bg-yellow-400 transition">
                💬 카톡 상담
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
