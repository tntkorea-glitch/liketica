---
name: Project Status
description: Liketica 현재 진행 상태 및 다음 작업
type: project
originSessionId: 297fe0ad-e022-4aad-a20b-7bc943ccc1e7
---
## 현재 상태 (2026-04-15)
Liketica (구 InstaBot Pro) — Instagram 자동화 SaaS 웹앱, 핵심 기능 + 고급 설정 구현

**완료된 작업:**
- Next.js 16 + TypeScript + Tailwind CSS 프로젝트 셋업
- 랜딩페이지 + 대시보드 UI 10개 페이지 (settings 추가)
- Prisma 7 + SQLite/Turso (libsql adapter) DB
- NextAuth v5 인증 (회원가입/로그인/세션/JWT)
- 12개 API 라우트 (dashboard, accounts, accounts/verify-2fa, analytics, automation, automation/run, automation/status, tags, comments, schedule, proxies, notifications)
- 3개 결제 API (billing/checkout, billing/portal, billing/webhook)
- Instagram 자동화 엔진 (instagram-private-api 기반: 팔로우/언팔로우/좋아요/댓글)
- Stripe 결제 시스템 (4단계 플랜)
- Turso 클라우드 DB + Vercel 프로덕션 배포
- **대시보드 기간 필터** (7/30/90일, 서버사이드 필터링)
- **프록시 관리** (Proxy 모델 + CRUD API + 설정 페이지 + 계정 연결 드롭다운)
- **Instagram 2FA 지원** (TwoFactorRequiredError 감지 + pending_2fa 상태 + 코드 입력 모달)
- **이메일 알림 시스템** (Resend/SMTP 추상화, NotificationPreference, NotificationLog, 자동화 오류 시 자동 발송)

**기술 스택:**
- Prisma 7.x: adapter 패턴 필수 (PrismaLibSql), `@/generated/prisma/client`에서 import
- 마이그레이션은 수동 작성 가능 (prod는 Turso `db push` 패턴으로 관리되는 듯)
- DB: 로컬 dev.db + Turso 클라우드 (TURSO_DATABASE_URL/TURSO_AUTH_TOKEN)
- Zod v4: `error.message` 직접 사용
- Stripe: Proxy 패턴 lazy init
- instagram-private-api: 2FA는 IgLoginTwoFactorRequiredError 포착 → 모듈 스코프 Map에 pending 세션 저장 → completeTwoFactorLogin 호출
- 이메일: Resend 우선, SMTP fallback (nodemailer는 optional peer dep, dynamic import)

## Next up when resuming
1. Stripe 프로덕션 설정 (Secret Key, Price ID, Webhook Secret 환경변수)
2. 실제 Instagram 계정으로 자동화/2FA 테스트
3. RESEND_API_KEY 또는 SMTP_* 환경변수 Vercel에 등록 (이메일 동작하려면 필수)
4. 이메일 알림 UI와 연동되는 일일 리포트 cron job 구축
5. InstaAccount.password 및 Proxy.password 암호화 (현재 평문 저장, TODO 주석 있음)
6. 프록시 연결 테스트 버튼 (현재는 UI만 있음)
7. 사용자 프로필/비밀번호 변경 페이지
