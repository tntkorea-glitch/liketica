import Link from "next/link";

export default function Footer() {
  return (
    <footer id="support" className="bg-slate-100 border-t-4 border-slate-900 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* 고객센터 */}
          <div>
            <p className="font-black text-slate-900 text-sm mb-3">고객센터</p>
            <p className="text-3xl font-black text-orange-600 leading-none mb-2">1588-0000</p>
            <p>평일 09:00 ~ 18:00</p>
            <p>점심 12:00 ~ 13:00</p>
            <p>주말·공휴일 휴무</p>
            <div className="flex gap-2 mt-3">
              <a
                href="https://pf.kakao.com/_liketica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-300 text-yellow-900 rounded font-bold text-xs hover:bg-yellow-400 transition"
              >
                💬 카톡 상담
              </a>
            </div>
          </div>

          {/* 이용안내 */}
          <div>
            <p className="font-black text-slate-900 text-sm mb-3">이용안내</p>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-slate-900">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900 font-bold">개인정보처리방침</Link></li>
              <li><Link href="/refund" className="hover:text-slate-900">환불정책</Link></li>
              <li><Link href="/guide" className="hover:text-slate-900">사용 가이드</Link></li>
              <li><Link href="#faq" className="hover:text-slate-900">자주 묻는 질문</Link></li>
            </ul>
          </div>

          {/* 결제안내 */}
          <div>
            <p className="font-black text-slate-900 text-sm mb-3">결제 / 무통장 입금</p>
            <p className="mb-1">국민은행 000-00-0000-000</p>
            <p className="mb-3">예금주: (주)라이케티카</p>
            <p className="text-[11px] text-slate-500">* 토스 / 카카오페이 / 네이버페이 / 카드 결제 가능</p>
          </div>

          {/* 회사정보 */}
          <div>
            <p className="font-black text-slate-900 text-sm mb-3">회사정보</p>
            <p>상호: (주)라이케티카</p>
            <p>대표: 홍길동</p>
            <p>사업자등록: 000-00-00000</p>
            <p>통신판매업: 2026-서울강남-00000</p>
            <p>주소: 서울특별시 강남구 테헤란로 000</p>
            <p>메일: support@instabotpro.com</p>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-4 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} InstaBot Pro. All rights reserved.</p>
          <p>인스타봇 프로는 Instagram과 제휴 관계가 아닙니다.</p>
        </div>
      </div>
    </footer>
  );
}
