"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── SVG Icon Components ─── */
function IconFollow() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-indigo-400">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M19 8v6m3-3h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-pink-400">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconComment() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-purple-400">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 9h8M8 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconMulti() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconSchedule() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-amber-400">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-400 shrink-0">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-zinc-600 shrink-0">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={`text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Data ─── */
const features = [
  {
    icon: <IconFollow />,
    title: "자동 팔로우/언팔",
    desc: "타겟 해시태그 기반 자동 팔로우, 스마트 언팔로 최적의 팔로잉 비율을 유지합니다.",
  },
  {
    icon: <IconHeart />,
    title: "자동 좋아요",
    desc: "관심 태그 게시물에 자동으로 좋아요를 보내 자연스러운 노출을 확보합니다.",
  },
  {
    icon: <IconComment />,
    title: "자동 댓글",
    desc: "AI 기반 자연스러운 댓글을 자동 작성하여 진정성 있는 소통을 만들어냅니다.",
  },
  {
    icon: <IconMulti />,
    title: "다중 계정 관리",
    desc: "여러 인스타그램 계정을 하나의 대시보드에서 통합 관리할 수 있습니다.",
  },
  {
    icon: <IconSchedule />,
    title: "스케줄링",
    desc: "시간대별 자동 실행과 랜덤 딜레이로 자연스러운 활동 패턴을 구현합니다.",
  },
  {
    icon: <IconChart />,
    title: "실시간 분석",
    desc: "팔로워 증감, 좋아요 통계 등을 실시간 대시보드에서 한눈에 확인합니다.",
  },
];

const comparisonRows = [
  "웹/모바일 지원",
  "AI 댓글",
  "실시간 대시보드",
  "멀티 디바이스",
  "자동 업데이트",
  "안전한 암호화",
];

const plans = [
  {
    name: "Basic",
    price: "무료",
    period: "",
    desc: "시작하기 좋은 무료 플랜",
    features: ["1개 계정", "일 50 좋아요", "일 20 팔로우", "기본 분석"],
    cta: "무료로 시작하기",
    popular: false,
  },
  {
    name: "Pro",
    price: "₩49,000",
    period: "/월",
    desc: "성장을 가속하는 프로 플랜",
    features: [
      "3개 계정",
      "무제한 좋아요",
      "무제한 팔로우",
      "자동 댓글",
      "스케줄링",
      "우선 지원",
    ],
    cta: "Pro 시작하기",
    popular: true,
  },
  {
    name: "Business",
    price: "₩99,000",
    period: "/월",
    desc: "대규모 운영을 위한 비즈니스 플랜",
    features: [
      "10개 계정",
      "모든 Pro 기능",
      "분석 대시보드",
      "전담 매니저",
      "API 접근",
      "우선 지원",
    ],
    cta: "Business 시작하기",
    popular: false,
  },
];

const faqs = [
  {
    q: "계정이 차단되지 않나요?",
    a: "InstaBot Pro는 인간과 유사한 활동 패턴과 안전한 속도 제한을 적용합니다. 랜덤 딜레이와 자연스러운 행동 시뮬레이션으로 계정 안전을 최우선으로 보장합니다.",
  },
  {
    q: "어떤 기기에서 사용할 수 있나요?",
    a: "웹 기반 서비스이므로 PC, 태블릿, 스마트폰 등 인터넷 브라우저가 있는 모든 기기에서 이용할 수 있습니다. 별도 프로그램 설치가 필요 없습니다.",
  },
  {
    q: "환불이 가능한가요?",
    a: "모든 유료 플랜은 7일 무료 체험이 포함되어 있습니다. 체험 기간 내 언제든 해지할 수 있으며, 결제 후에도 7일 이내 환불을 보장합니다.",
  },
];

/* ─── FAQ Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-base font-medium text-white pr-4">{q}</span>
        <IconChevron open={open} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ━━━ Hero ━━━ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-[#0a0a0f] to-purple-950/60" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px]" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-32">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              현재 1,200+ 사용자가 성장 중
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                인스타그램 성장을
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                자동화하세요
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
              팔로우, 좋아요, 댓글을 AI가 자동으로 관리합니다.
              <br className="hidden sm:block" />
              더 이상 수동으로 시간을 낭비하지 마세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                무료로 시작하기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all"
              >
                요금제 보기
              </a>
            </div>
          </div>
        </section>

        {/* ━━━ Features ━━━ */}
        <section id="features" className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">
                Features
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                강력한 자동화 기능
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                인스타그램 성장에 필요한 모든 것을 하나의 플랫폼에서 제공합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Comparison ━━━ */}
        <section className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">
                Comparison
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                왜 InstaBot Pro인가요?
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                경쟁사 대비 확실한 차별점을 확인하세요.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.02]">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-white/[0.03] border-b border-white/5">
                <div className="px-6 py-4 text-sm font-semibold text-zinc-400">
                  기능
                </div>
                <div className="px-6 py-4 text-sm font-semibold text-zinc-500 text-center">
                  경쟁사
                </div>
                <div className="px-6 py-4 text-sm font-semibold text-center">
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    InstaBot Pro
                  </span>
                </div>
              </div>
              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={row}
                  className={`grid grid-cols-3 ${
                    i !== comparisonRows.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <div className="px-6 py-4 text-sm text-zinc-300">{row}</div>
                  <div className="px-6 py-4 flex items-center justify-center">
                    <IconX />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-center">
                    <IconCheck />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Pricing ━━━ */}
        <section id="pricing" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">
                Pricing
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                합리적인 요금제
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                필요에 맞는 플랜을 선택하세요. 모든 유료 플랜은 7일 무료 체험이 포함됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-2 border-indigo-500/30 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                      : "bg-white/[0.03] border border-white/5 hover:border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                      가장 인기
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6">{plan.desc}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-zinc-500">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <IconCheck />
                        <span className="text-sm text-zinc-300">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/dashboard"
                    className={`block text-center py-3 rounded-full text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                        : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ FAQ ━━━ */}
        <section id="faq" className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                자주 묻는 질문
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ CTA Bottom ━━━ */}
        <section id="contact" className="py-24 sm:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/5">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                무료 플랜으로 InstaBot Pro의 모든 핵심 기능을 체험해보세요.
                <br />
                신용카드 없이 시작할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  무료로 시작하기
                </Link>
                <a
                  href="https://pf.kakao.com/_instabotpro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                    <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67l-.96 3.56c-.08.31.27.56.54.38l4.24-2.82c.49.05 1 .08 1.52.08 5.52 0 10-3.58 10-7.87S17.52 3 12 3z" />
                  </svg>
                  카카오톡 상담
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
