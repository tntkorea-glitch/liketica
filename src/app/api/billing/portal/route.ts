import { getAuthUser, unauthorized } from "@/lib/api-utils";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// POST /api/billing/portal — open Stripe customer portal
export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.stripeCustomerId) {
    return Response.json({ error: "결제 정보가 없습니다" }, { status: 400 });
  }

  const baseUrl = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return Response.json({ url: session.url });
}
