---
name: Project Status
description: insta-app 현재 진행 상태 및 다음 작업
type: project
originSessionId: a7eaf693-e791-4af3-85eb-09379beb99e1
---
## 현재 상태 (2026-04-13)
InstaBot Pro — Instagram 자동화 SaaS 웹앱, 백엔드 연동 완료

**완료된 작업:**
- Next.js 16 + TypeScript + Tailwind CSS 프로젝트 셋업
- 랜딩페이지 + 대시보드 UI 8개 페이지
- Prisma 7 + SQLite (libsql adapter) DB 구축
- NextAuth v5 인증 (회원가입/로그인/세션/JWT)
- 7개 API 라우트 (dashboard, accounts, automation, tags, comments, schedule, analytics)
- 프론트엔드-백엔드 연동 (대시보드, 계정관리, 자동화설정, 태그관리, 댓글관리)
- GitHub 푸시 완료

**기술 스택:**
- Prisma 7.x: adapter 패턴 필수 (PrismaLibSql), `@/generated/prisma/client`에서 import
- DB 파일: 프로젝트 루트의 `dev.db` (prisma/ 아님)
- Zod v4: `error.message` 직접 사용 (v3의 `error.errors[0].message` 아님)

**Why:** 경쟁사보다 현대적인 웹 기반 SaaS로 차별화
**How to apply:** 스케줄/분석 페이지 API 연동 + 실제 Instagram 자동화 엔진 구현 필요

## Next up when resuming
1. 스케줄/분석 페이지 API 연동 마무리
2. Vercel 배포 연결 (`vercel link`)
3. 실제 Instagram 자동화 엔진 구현 (Puppeteer/Playwright)
4. 결제 시스템 연동
