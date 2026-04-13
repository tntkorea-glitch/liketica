import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/api-utils";

// GET /api/dashboard - 대시보드 요약 데이터
export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const accounts = await prisma.instaAccount.findMany({
    where: { userId: user.id },
  });

  const totalFollowers = accounts.reduce((sum, a) => sum + a.followers, 0);
  const totalFollowing = accounts.reduce((sum, a) => sum + a.following, 0);
  const activeAccounts = accounts.filter((a) => a.active).length;

  // 오늘 활동 로그
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLogs = await prisma.activityLog.findMany({
    where: {
      instaAccountId: { in: accounts.map((a) => a.id) },
      createdAt: { gte: today },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      instaAccount: { select: { username: true } },
    },
  });

  const todayStats = {
    follows: todayLogs.filter((l) => l.type === "follow" && l.status === "success").length,
    likes: todayLogs.filter((l) => l.type === "like" && l.status === "success").length,
    comments: todayLogs.filter((l) => l.type === "comment" && l.status === "success").length,
    unfollows: todayLogs.filter((l) => l.type === "unfollow" && l.status === "success").length,
  };

  return Response.json({
    stats: {
      totalFollowers,
      totalFollowing,
      activeAccounts,
      totalAccounts: accounts.length,
    },
    todayStats,
    recentLogs: todayLogs.map((log) => ({
      id: log.id,
      time: log.createdAt,
      account: log.instaAccount.username,
      type: log.type,
      target: log.target,
      status: log.status,
    })),
    accounts: accounts.map((a) => ({
      id: a.id,
      username: a.username,
      followers: a.followers,
      following: a.following,
      active: a.active,
      status: a.status,
    })),
  });
}
