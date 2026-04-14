import Link from "next/link";

const skins = [
  {
    n: "01",
    slug: "1-bento",
    title: "Bento Grid",
    desc: "Apple/Linear 스타일. 비대칭 타일 그리드 하나로 전체 정보 집약.",
    bg: "bg-gradient-to-br from-slate-50 to-sky-50 text-slate-900",
    tag: "모던 · 미니멀 · 타일식",
  },
  {
    n: "02",
    slug: "2-editorial",
    title: "Editorial Magazine",
    desc: "세리프 타이포 + 넘버링 + 두꺼운 가로 룰. 인쇄 매거진 느낌.",
    bg: "bg-[#faf7f2] text-stone-900",
    tag: "클래식 · 타이포 중심 · 고급감",
  },
  {
    n: "03",
    slug: "3-terminal",
    title: "Terminal / Dev Console",
    desc: "모노스페이스, 블랙 + 네온 그린. 터미널 타이핑 애니메이션.",
    bg: "bg-black text-emerald-400 font-mono",
    tag: "기술적 · 해커 감성 · 튐",
  },
  {
    n: "04",
    slug: "4-demo",
    title: "Interactive Demo-First",
    desc: "마케팅 카피 최소. 가짜 대시보드가 라이브로 동작하는 모습 시연.",
    bg: "bg-[#0b0d12] text-white",
    tag: "프리미엄 · 제품 중심 · 설명보다 시연",
  },
  {
    n: "05",
    slug: "5-shop",
    title: "Korean Shop Style",
    desc: "라이크마켓/월드바이럴 느낌. 상품 카드 그리드, 오렌지 CTA, 😎",
    bg: "bg-white text-slate-900",
    tag: "친숙 · 이커머스 · 즉시 구매 유도",
  },
];

export default function SkinIndex() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Skin Comparison</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">InstaBot Pro — 5가지 스킨 후보</h1>
          <p className="text-slate-600 mt-2">각 카드를 클릭해서 풀페이지로 확인하세요. 구조가 완전히 다른 5종입니다.</p>
          <Link href="/" className="inline-block mt-4 text-sm text-pink-600 hover:underline">← 현재 적용된 워엄 그라데이션 스킨(원본) 보기</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skins.map((s) => (
            <Link
              key={s.slug}
              href={`/skin/${s.slug}`}
              className={`group rounded-3xl p-8 border border-slate-200 hover:border-slate-400 transition-all hover:-translate-y-1 hover:shadow-xl ${s.bg}`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-xs font-mono opacity-60">{s.n}</span>
                <span className="text-xs opacity-60 group-hover:opacity-100 transition">→</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{s.title}</h2>
              <p className="text-sm opacity-70 mb-4">{s.desc}</p>
              <p className="text-xs opacity-50">{s.tag}</p>
            </Link>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-8">/skin/1-bento, /skin/2-editorial, /skin/3-terminal, /skin/4-demo, /skin/5-shop</p>
      </div>
    </main>
  );
}
