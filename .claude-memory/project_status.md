---
name: Project Status
description: insta-app 현재 진행 상태 및 다음 작업
type: project
originSessionId: 297fe0ad-e022-4aad-a20b-7bc943ccc1e7
---
## 현재 상태 (2026-04-14)
InstaBot Pro — Instagram 자동화 SaaS 웹앱, 전체 기능 구현 완료

**완료된 작업:**
- Next.js 16 + TypeScript + Tailwind CSS 프로젝트 셋업
- 랜딩페이지 + 대시보드 UI 9개 페이지 (billing 추가)
- Prisma 7 + SQLite/Turso (libsql adapter) DB 구축
- NextAuth v5 인증 (회원가입/로그인/세션/JWT)
- 9개 API 라우트 (dashboard, accounts, automation, automation/run, automation/status, tags, comments, schedule, analytics)
- 3개 결제 API (billing/checkout, billing/portal, billing/webhook)
- 프론트엔드-백엔드 연동 (전 페이지)
- Instagram 자동화 엔진 (instagram-private-api 기반: 팔로우/언팔로우/좋아요/댓글)
- Stripe 결제 시스템 (4단계 플랜: FREE/STARTER/PRO/ENTERPRISE)
- Turso 클라우드 DB 연결 (ap-northeast-1 리전)
- Vercel 프로덕션 배포 완료

**기술 스택:**
- Prisma 7.x: adapter 패턴 필수 (PrismaLibSql), `@/generated/prisma/client`에서 import
- DB: 로컬 dev.db + Turso 클라우드 (TURSO_DATABASE_URL/TURSO_AUTH_TOKEN 환경변수)
- Zod v4: `error.message` 직접 사용
- Stripe: Proxy 패턴으로 lazy init (빌드 시 API 키 없어도 동작)
- instagram-private-api: 자동화 엔진 core

**Why:** 경쟁사보다 현대적인 웹 기반 SaaS로 차별화
**How to apply:** 아래 남은 작업 참고

## Next up when resuming
1. Stripe 프로덕션 설정 (Secret Key, Price ID, Webhook Secret 환경변수)
2. 실제 Instagram 계정으로 자동화 테스트
3. 프록시 관리 기능
4. 2FA 지원 (Instagram 2단계 인증)
5. 이메일 알림 시스템
6. 사용자 대시보드 기간 필터 기능 (7일/30일)
