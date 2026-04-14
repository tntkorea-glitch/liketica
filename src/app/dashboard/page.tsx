"use client";

import { useState, useEffect } from "react";

interface DashboardData {
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    activeAccounts: number;
    totalAccounts: number;
  };
  todayStats: {
    follows: number;
    likes: number;
    comments: number;
    unfollows: number;
  };
  recentLogs: {
    id: string;
    time: string;
    account: string;
    type: string;
    target: string;
    status: string;
  }[];
}

const typeLabels: Record<string, string> = {
  follow: "팔로우",
  unfollow: "언팔로우",
  like: "좋아요",
  comment: "댓글",
};

function StatIcon({ type }: { type: string }) {
  switch (type) {
    case "followers":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    case "likes":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    case "comments":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod] = useState("오늘");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statsCards = data
    ? [
        {
          label: "총 팔로워",
          value: data.stats.totalFollowers.toLocaleString(),
          change: `${data.stats.totalAccounts}개 계정`,
          changeType: "neutral" as const,
          icon: "followers",
        },
        {
          label: "오늘 팔로우",
          value: data.todayStats.follows.toString(),
          change: "오늘",
          changeType: "up" as const,
          icon: "likes",
        },
        {
          label: "오늘 좋아요",
          value: data.todayStats.likes.toString(),
          change: "오늘",
          changeType: "up" as const,
          icon: "comments",
        },
        {
          label: "활성 계정",
          value: `${data.stats.activeAccounts}/${data.stats.totalAccounts}`,
          change: "활성",
          changeType: "neutral" as const,
          icon: "accounts",
        },
      ]
    : [];

  const taskProgress = data
    ? [
        { label: "팔로우", current: data.todayStats.follows, max: 50, color: "from-indigo-500 to-blue-500" },
        { label: "좋아요", current: data.todayStats.likes, max: 100, color: "from-purple-500 to-pink-500" },
        { label: "댓글", current: data.todayStats.comments, max: 20, color: "from-emerald-500 to-teal-500" },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">대시보드</h1>
          <p className="text-sm text-gray-400 mt-1">Liketica 자동화 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          {["오늘", "7일", "30일"].map((p) => (
            <button
              key={p}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPeriod === p
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <StatIcon type={stat.icon} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className={`text-xs font-medium ${stat.changeType === "up" ? "text-emerald-400" : "text-indigo-400"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats summary */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">오늘의 활동 요약</h2>
          {data && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "팔로우", value: data.todayStats.follows, color: "text-blue-400" },
                { label: "언팔로우", value: data.todayStats.unfollows, color: "text-orange-400" },
                { label: "좋아요", value: data.todayStats.likes, color: "text-pink-400" },
                { label: "댓글", value: data.todayStats.comments, color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Progress */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">오늘의 작업 진행률</h2>
          <div className="space-y-5">
            {taskProgress.map((task) => (
              <div key={task.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{task.label}</span>
                  <span className="text-sm font-medium text-white">
                    {task.current}/{task.max}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`bg-gradient-to-r ${task.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${Math.min((task.current / task.max) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.min(Math.round((task.current / task.max) * 100), 100)}% 완료
                </p>
              </div>
            ))}
          </div>
          {taskProgress.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">전체 진행률</span>
                <span className="text-lg font-bold text-indigo-400">
                  {Math.min(
                    Math.round(
                      (taskProgress.reduce((a, t) => a + t.current, 0) /
                        taskProgress.reduce((a, t) => a + t.max, 0)) *
                        100
                    ),
                    100
                  )}
                  %
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">최근 활동 로그</h2>
        </div>
        <div className="overflow-x-auto">
          {data?.recentLogs && data.recentLogs.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-700">
                  <th className="pb-3 pr-4">시간</th>
                  <th className="pb-3 pr-4">계정</th>
                  <th className="pb-3 pr-4">작업유형</th>
                  <th className="pb-3 pr-4">대상</th>
                  <th className="pb-3">상태</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-3 pr-4 text-gray-400">
                      {new Date(log.time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 pr-4 text-indigo-400 font-medium">@{log.account}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.type === "follow"
                            ? "bg-blue-500/20 text-blue-400"
                            : log.type === "like"
                            ? "bg-pink-500/20 text-pink-400"
                            : log.type === "comment"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {typeLabels[log.type] || log.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-300">{log.target}</td>
                    <td className="py-3">
                      {log.status === "success" ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          성공
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 text-xs">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                          실패
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">활동 로그가 없습니다</p>
              <p className="text-sm">계정을 추가하고 자동화를 시작하면 여기에 로그가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
