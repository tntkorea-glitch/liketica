import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/api-utils";

// GET /api/analytics?period=7|30|90
export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const periodParam = Number(searchParams.get("period"));
  const days = [7, 30, 90].includes(periodParam) ? periodParam : 30;

  const accounts = await prisma.instaAccount.findMany({
    where: { userId: user.id },
    select: { id: true, username: true, followers: true, following: true },
  });

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const analyticsData = await prisma.analyticsDaily.findMany({
    where: {
      instaAccountId: { in: accounts.map((a) => a.id) },
      date: { gte: cutoff },
    },
    orderBy: { date: "asc" },
  });

  // 최근 활동 로그
  const recentLogs = await prisma.activityLog.findMany({
    where: {
      instaAccountId: { in: accounts.map((a) => a.id) },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      instaAccount: { select: { username: true } },
    },
  });

  return Response.json({
    accounts,
    analytics: analyticsData,
    recentLogs,
  });
}
