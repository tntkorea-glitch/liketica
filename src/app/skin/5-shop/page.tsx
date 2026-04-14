import Link from "next/link";

const categories = [
  { label: "🎯 전체", active: true },
  { label: "인스타그램" },
  { label: "틱톡" },
  { label: "유튜브" },
  { label: "페이스북" },
  { label: "블로그" },
  { label: "기타" },
];

const products = [
  {
    badge: "BEST",
    badgeColor: "bg-rose-500",
    emoji: "🔥",
    tag: "인스타그램 · 팔로워",
    title: "인스타 실제 한국인 팔로워 100명",
    price: "12,000",
    original: "18,000",
    rating: "4.9",
    reviews: 2847,
    sold: "3,421",
  },
  {
    badge: "HOT",
    badgeColor: "bg-orange-500",
    emoji: "💥",
    tag: "인스타그램 · 좋아요",
    title: "인스타 좋아요 자동 1000개",
    price: "9,900",
    original: "14,900",
    rating: "4.8",
    reviews: 1204,
    sold: "1,892",
  },
  {
    badge: "NEW",
    badgeColor: "bg-blue-500",
    emoji: "✨",
    tag: "인스타그램 · 자동화",
    title: "Liketica 월 구독 (Pro)",
    price: "49,000",
    original: "79,000",
    rating: "5.0",
    reviews: 428,
    sold: "512",
  },
  {
    badge: "추천",
    badgeColor: "bg-violet-500",
    emoji: "⭐",
    tag: "인스타그램 · 댓글",
    title: "AI 자연스러운 댓글 500개",
    price: "19,000",
    original: "29,000",
    rating: "4.7",
    reviews: 891,
    sold: "1,123",
  },
];

const blogPosts = [
  { cat: "성장 팁", title: "인스타 팔로워 3배 늘린 7가지 방법 👋", date: "2026.04.10" },
  { cat: "안전 가이드", title: "자동화 써도 계정 안 막히는 원칙 5가지", date: "2026.04.08" },
  { cat: "후기", title: "월 1000→15000 팔로워, 3개월 만에 성공한 썰", date: "2026.04.05" },
];

export default function ShopSkin() {
  return (
    <main className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'Pretendard, "Malgun Gothic", sans-serif' }}>
      {/* Top utility bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">365일 운영 · 즉시 자동화 시작</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:text-slate-900">로그인</Link>
            <span className="text-slate-300">|</span>
            <Link href="/signup" className="hover:text-slate-900">회원가입</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-slate-900">주문조회</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-slate-900">고객센터</Link>
            <span className="text-slate-300">|</span>
            <Link href="/skin" className="text-slate-400 hover:text-slate-900">← 스킨 비교</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b-2 border-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-black">B</div>
            <span className="text-xl font-black tracking-tight">라이케티카</span>
          </Link>
          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <input placeholder="어떤 서비스를 찾으세요? (예: 팔로워, 좋아요)" className="flex-1 border-2 border-orange-500 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none" />
            <button className="bg-orange-500 text-white px-5 rounded-r-lg text-sm font-bold hover:bg-orange-600">검색</button>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="#" className="relative">
              <span className="text-xl">🛒</span>
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Category nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.label}
                className={`whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-2 transition ${
                  c.active ? "border-orange-500 text-orange-600" : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Promo banner */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white p-6 sm:p-8 relative overflow-hidden">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">🔥 이번 주 특가</p>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2">
              첫 달 50% 할인<br />
              <span className="text-yellow-200">+ 7일 무료 체험</span>
            </h2>
            <p className="text-sm opacity-90 mb-4">신규 회원 한정 · 카드 등록 없이 시작</p>
            <Link href="/dashboard" className="inline-block bg-white text-rose-600 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-yellow-50">
              지금 시작하기 →
            </Link>
            <div className="absolute -right-6 -bottom-6 text-[120px] opacity-30">😎</div>
          </div>
          <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">👋 가이드</p>
              <h3 className="text-xl font-black leading-tight">차단 없이 자동화하는 법</h3>
            </div>
            <Link href="#" className="text-sm text-yellow-300 font-bold hover:underline">자세히 보기 →</Link>
          </div>
        </div>
      </section>

      {/* Best products */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl font-black">😎 베스트 서비스</h2>
          <Link href="#" className="text-sm text-slate-500 hover:text-slate-900">전체보기 →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.title} className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all bg-white">
              <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-7xl">
                {p.emoji}
                <span className={`absolute top-2 left-2 ${p.badgeColor} text-white text-[10px] font-black px-2 py-1 rounded`}>{p.badge}</span>
                <button className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  🛒
                </button>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-400 mb-1">{p.tag}</p>
                <p className="text-sm font-semibold leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{p.title}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-black text-rose-600">₩{p.price}</span>
                  <span className="text-xs text-slate-400 line-through">₩{p.original}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="text-amber-500">★</span>
                  <span className="font-bold text-slate-700">{p.rating}</span>
                  <span>({p.reviews.toLocaleString()})</span>
                  <span className="ml-auto">판매 {p.sold}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust icons */}
      <section className="max-w-6xl mx-auto px-4 py-8 border-y border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🔒", t: "안전 결제", s: "토스·카카오페이" },
            { icon: "⚡", t: "즉시 시작", s: "결제 후 바로 작동" },
            { icon: "💬", t: "24시간 상담", s: "카카오톡 채널" },
            { icon: "↩️", t: "100% 환불", s: "7일 내 무조건" },
          ].map((b) => (
            <div key={b.t}>
              <p className="text-3xl mb-1">{b.icon}</p>
              <p className="font-bold text-sm">{b.t}</p>
              <p className="text-xs text-slate-500">{b.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl sm:text-3xl font-black mb-5">👋 블로그 추천</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blogPosts.map((b) => (
            <Link key={b.title} href="#" className="group">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 group-hover:scale-[1.02] transition-transform" />
              <p className="text-xs text-orange-600 font-bold mb-1">{b.cat}</p>
              <p className="font-bold leading-tight mb-1 group-hover:text-orange-600 transition">{b.title}</p>
              <p className="text-xs text-slate-400">{b.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t-4 border-slate-900 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="font-black text-slate-900 mb-2">고객센터</p>
              <p className="text-2xl font-black text-orange-600">1588-0000</p>
              <p>평일 09:00 ~ 18:00</p>
              <p>점심 12:00 ~ 13:00</p>
            </div>
            <div>
              <p className="font-black text-slate-900 mb-2">이용안내</p>
              <p>이용약관</p>
              <p>개인정보처리방침</p>
              <p>환불정책</p>
            </div>
            <div>
              <p className="font-black text-slate-900 mb-2">무통장 입금</p>
              <p>국민은행 000-00-0000-000</p>
              <p>예금주: (주)라이케티카</p>
            </div>
            <div>
              <p className="font-black text-slate-900 mb-2">회사정보</p>
              <p>(주)라이케티카</p>
              <p>대표: 홍길동 · 사업자: 000-00-00000</p>
              <p>서울특별시 강남구 테헤란로 000</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-4 flex flex-col sm:flex-row justify-between gap-2">
            <p>&copy; 2026 Liketica. All rights reserved.</p>
            <p>Skin 05 — Korean Shop Style</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
