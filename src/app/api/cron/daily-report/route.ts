import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDailyReport } from "@/lib/notifications";

export const dynamic = "force-dynamic";

async function runReport() {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const recipients = await prisma.notificationPreference.findMany({
    where: { notifyDailyReport: true, emailEnabled: true },
    select: { userId: true },
  });

  const results: { userId: string; ok: boolean; error?: string }[] = [];
  for (const r of recipients) {
    try {
      const res = await sendDailyReport(r.userId, yesterday, today);
      results.push({ userId: r.userId, ok: res.ok, error: res.ok ? undefined : res.error });
    } catch (e) {
      results.push({ userId: r.userId, ok: false, error: e instanceof Error ? e.message : "unknown" });
    }
  }

  return {
    range: { start: yesterday.toISOString(), end: today.toISOString() },
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const summary = await runReport();
  return Response.json(summary);
}
