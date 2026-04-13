import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    accounts: 1,
    dailyLimit: 100,
    features: ["계정 1개", "일일 100회 제한", "기본 분석"],
  },
  STARTER: {
    name: "Starter",
    price: 19900, // KRW
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    accounts: 3,
    dailyLimit: 500,
    features: ["계정 3개", "일일 500회 제한", "상세 분석", "스케줄 관리"],
  },
  PRO: {
    name: "Pro",
    price: 49900,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    accounts: 10,
    dailyLimit: 2000,
    features: ["계정 10개", "일일 2,000회 제한", "프리미엄 분석", "우선 지원", "AI 댓글"],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 99900,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    accounts: -1, // unlimited
    dailyLimit: -1,
    features: ["무제한 계정", "무제한 작업", "전용 프록시", "1:1 전담 지원", "커스텀 기능"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
