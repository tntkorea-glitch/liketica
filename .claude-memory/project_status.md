---
name: Project Status
description: Liketica 현재 진행 상태 및 다음 작업
type: project
originSessionId: 297fe0ad-e022-4aad-a20b-7bc943ccc1e7
---
## 현재 상태 (2026-04-17)
Liketica (구 InstaBot Pro) — Instagram 자동화 SaaS 웹앱, 핵심 기능 + 고급 설정 + 보안/운영 기능 구현

**완료된 작업:**
- Next.js 16 + TypeScript + Tailwind CSS 프로젝트 셋업
- 랜딩페이지 + 대시보드 UI 11개 페이지 (account 추가)
- Prisma 7 + SQLite/Turso (libsql adapter) DB
- NextAuth v5 인증 (회원가입/로그인/세션/JWT)
- API 라우트 다수 (dashboard, accounts/verify-2fa, analytics, automation, tags, comments, schedule, proxies, proxies/[id]/test, notifications, user/profile, user/password, cron/daily-report)
- 3개 결제 API (billing/checkout, billing/portal, billing/webhook)
- Instagram 자동화 엔진 (팔로우/언팔로우/좋아요/댓글, 2FA 지원)
- Stripe 결제 시스템 (4단계 플랜)
- Turso 클라우드 DB + Vercel 프로덕션 배포
- 대시보드 기간 필터, 프록시 관리, Instagram 2FA, 이메일 알림 (Resend/SMTP)
- **비밀번호 암호화 (2026-04-17):** AES-256-GCM, `enc:v1:` 프리픽스 기반. `src/lib/crypto.ts`에 encrypt/decrypt. 키는 ENCRYPTION_KEY > NEXTAUTH_SECRET > AUTH_SECRET 우선순위로 scrypt 파생. 평문 레거시 값은 decrypt가 pass-through해서 점진적 마이그레이션. `scripts/encrypt-existing.ts`로 일괄 전환 가능
- **프록시 연결 테스트 (2026-04-17):** `POST /api/proxies/[id]/test`가 TCP connect로 host:port reachability 검증 (5초 타임아웃). settings 페이지에 버튼 + OK/FAIL 뱃지
- **사용자 프로필/비밀번호 변경 (2026-04-17):** `/dashboard/account` 페이지, `/api/user/profile` (GET/PUT name), `/api/user/password` (PUT, bcrypt 12)
- **일일 리포트 cron (2026-04-17):** `GET /api/cron/daily-report` — notifyDailyReport+emailEnabled 사용자에게 어제 AnalyticsDaily 집계 + ActivityLog 실패 건수 이메일. Vercel Cron `0 15 * * *` (UTC, = KST 자정). CRON_SECRET 설정 시 Bearer 토큰 검증

**기술 스택:**
- Prisma 7.x: adapter 패턴 필수 (PrismaLibSql), `@/generated/prisma/client`에서 import
- DB: 로컬 dev.db + Turso 클라우드 (TURSO_DATABASE_URL/TURSO_AUTH_TOKEN)
- Zod v4: `error.message` 직접 사용
- Stripe: Proxy 패턴 lazy init
- instagram-private-api: 2FA는 IgLoginTwoFactorRequiredError 포착 → 모듈 스코프 Map에 pending 세션 저장 → completeTwoFactorLogin 호출
- 이메일: Resend 우선, SMTP fallback (nodemailer는 optional peer dep, dynamic import)
- Next.js 16 route handler: `ctx.params`는 Promise — `await ctx.params`로 추출

## Next up when resuming
1. Stripe 프로덕션 설정 (Secret Key, Price ID, Webhook Secret 환경변수)
2. 실제 Instagram 계정으로 자동화/2FA 테스트
3. Vercel에 환경변수 등록 — RESEND_API_KEY(또는 SMTP_*), ENCRYPTION_KEY(권장), CRON_SECRET
4. 배포 후 `npx tsx scripts/encrypt-existing.ts`로 기존 평문 비밀번호 일괄 암호화 (Turso 접근 가능한 로컬에서 실행)
5. 프록시 테스트를 CONNECT 터널링으로 업그레이드 (현재는 TCP reachability만 확인 — 실제 인증/트래픽은 검증 못함)
6. 2FA 백업코드/TOTP(verificationMethod='0') UI 옵션
7. Unfollow 로직 개선 — 현재는 내 팔로워 중에서 2명씩 언팔. "N일 전 팔로우한 사용자"를 저장해서 타겟팅 필요
