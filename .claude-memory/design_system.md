---
name: Design System
description: insta-app 랜딩/공통 UI 디자인 시스템 (Instagram warm gradient 테마)
type: project
originSessionId: f15430ab-ed98-4c93-85e1-a15daa301f94
---
## 디자인 테마: Instagram Warm Gradient (2026-04-14 적용)

**컨셉:** 다른 프로젝트들과 스킨이 겹친다는 피드백으로 다크 인디고/퍼플 SaaS 템플릿에서 라이트 워엄 그라데이션으로 전체 리스킨.

**핵심 토큰 (globals.css + Tailwind arbitrary 값):**
- Background: `#fff7ee` (warm cream)
- Alt BG: `#ffe9d6` (peach), `#ffd9e8` (pink tint)
- Text primary: `#2a0f2d` (deep plum)
- Text muted: `#5a3b52` / `#7b5d6a`
- Instagram 5-stop gradient: `#feda75 → #fa7e1e → #d62976 → #962fbf → #4f5bd5`

**유틸리티 클래스 (globals.css):**
- `.insta-gradient` — 5색 백그라운드 그라데이션 (버튼/로고 아이콘)
- `.insta-gradient-text` — 3색(orange→pink→purple) bg-clip text
- `.insta-gradient-animated` — 8초 루프 background-position 애니메이션
- `@keyframes gradient-shift` 정의됨

**적용 범위:**
- `src/app/globals.css` — 라이트 테마 토큰 + 그라데이션 유틸
- `src/app/page.tsx` — 랜딩 전 섹션
- `src/components/Header.tsx` — 라이트 테마
- `src/components/Footer.tsx` — 다크 플럼(#2a0f2d) 유지해서 대비 포인트로 사용
- **대시보드 페이지들 (`src/app/dashboard/*`)은 아직 미적용** — 필요시 확장

**Why:** 인스타그램 제품과 직관적 매치 + 다른 프로젝트들(대부분 다크 인디고 템플릿)과 확실히 차별화
**How to apply:** 새 페이지 추가 시 위 토큰/유틸 재사용. 그라데이션 border는 page.tsx의 Pricing popular plan 참고 (linear-gradient 2-layer + backgroundClip padding-box,border-box 트릭).
