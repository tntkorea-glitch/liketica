"use client";

import { useState, useEffect, useCallback } from "react";

interface AnalyticsDaily {
  id: string;
  instaAccountId: string;
  date: string;
  followers: number;
  followersGained: number;
  followersLost: number;
  likes: number;
  comments: number;
  follows: number;
  unfollows: number;
}

interface InstaAccount {
  id: string;
  username: string;
  followers: number;
  following: number;
}

interface ActivityLog {
  id: string;
  type: string;
  target: string;
  status: string;
  createdAt: string;
  instaAccount: { username: string };
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7일" | "30일" | "90일">("7일");
  const [accounts, setAccounts] = useState<InstaAccount[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsDaily[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        setAnalytics(data.analytics || []);
        setRecentLogs(data.recentLogs || []);
      }
    } catch (e) {
      console.error("분석 데이터 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  // 기간별 데이터 필터링
  const periodDays = period === "7일" ? 7 : period === "30일" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays);
  const filtered = analytics.filter((a) => new Date(a.date) >= cutoff);

  // 요약 통계 계산
  const totalGained = filtered.reduce((s, a) => s + a.followersGained, 0);
  const totalLost = filtered.reduce((s, a) => s + a.followersLost, 0);
  const totalLikes = filtered.reduce((s, a) => s + a.likes, 0);
  const totalComments = filtered.reduce((s, a) => s + a.comments, 0);
  const totalFollows = filtered.reduce((s, a) => s + a.follows, 0);
  const followBackRate = totalFollows > 0 ? Math.round((totalGained / totalFollows) * 100) : 0;

  // 날짜별 그룹핑 (차트용)
  const dailyMap = new Map<string, { followers: number; gained: number; lost: number; likes: number; comments: number }>();
  filtered.forEach((a) => {
    const dateKey = new Date(a.date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    const prev = dailyMap.get(dateKey) || { followers: 0, gained: 0, lost: 0, likes: 0, comments: 0 };
    dailyMap.set(dateKey, {
      followers: prev.followers + a.followers,
      gained: prev.gained + a.followersGained,
      lost: prev.lost + a.followersLost,
      likes: prev.likes + a.likes,
      comments: prev.comments + a.comments,
    });
  });
  const dailyData = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }));

  // 시간대별 활동 분석 (로그 기반)
  const hourBuckets = Array(12).fill(0);
  recentLogs.forEach((log) => {
    const h = new Date(log.createdAt).getHours();
    const bucket = Math.floor(h / 2);
    if (log.status === "success") hourBuckets[bucket]++;
  });
  const maxBucket = Math.max(...hourBuckets, 1);
  const bestTimes = hourBuckets.map((count, i) => ({
    hour: `${String(i * 2).padStart(2, "0")}-${String(i * 2 + 2).padStart(2, "0")}`,
    score: Math.round((count / maxBucket) * 100),
  }));

  // 차트 범위
  const maxFollower = dailyData.length > 0 ? Math.max(...dailyData.map((d) => d.followers)) : 0;
  const minFollower = dailyData.length > 0 ? Math.min(...dailyData.map((d) => d.followers)) : 0;
  const maxLikeComment = dailyData.length > 0 ? Math.max(...dailyData.map((d) => Math.max(d.likes, d.comments)), 1) : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasData = dailyData.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">분석</h1>
          <p className="text-sm text-gray-400 mt-1">
            자동화 성과를 분석하고 최적화하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["7일", "30일", "90일"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-400">{period} 팔로워 증가</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">+{totalGained.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">감소 -{totalLost.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-400">{period} 좋아요</p>
          <p className="text-xl font-bold text-pink-400 mt-1">{totalLikes.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">일 평균 {periodDays > 0 ? Math.round(totalLikes / periodDays).toLocaleString() : 0}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-400">{period} 댓글</p>
          <p className="text-xl font-bold text-indigo-400 mt-1">{totalComments.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">일 평균 {periodDays > 0 ? Math.round(totalComments / periodDays).toLocaleString() : 0}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-400">팔로우백 비율</p>
          <p className="text-xl font-bold text-purple-400 mt-1">{followBackRate}%</p>
          <p className="text-xs text-gray-500 mt-1">총 {totalFollows.toLocaleString()}회 팔로우</p>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Follower Trend */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">팔로워 증감 추이</h2>
              <div className="flex items-end gap-2 h-48">
                {dailyData.map((d) => {
                  const range = maxFollower - minFollower || 1;
                  const height = ((d.followers - minFollower) / range) * 80 + 20;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-emerald-400">+{d.gained}</span>
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all hover:from-indigo-500 hover:to-purple-400 relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {d.followers.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">{d.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Like/Comment Stats */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">좋아요 / 댓글 통계</h2>
              <div className="flex items-end gap-2 h-48">
                {dailyData.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                      <div
                        className="flex-1 bg-gradient-to-t from-pink-600 to-pink-400 rounded-t-sm"
                        style={{ height: `${(d.likes / maxLikeComment) * 100}%` }}
                      />
                      <div
                        className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm"
                        style={{ height: `${(d.comments / maxLikeComment) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">{d.date}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-pink-500" />
                  <span className="text-xs text-gray-400">좋아요</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span className="text-xs text-gray-400">댓글</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Times */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">최적 활동 시간대</h2>
              <div className="space-y-3">
                {bestTimes.map((t) => (
                  <div key={t.hour} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-14">{t.hour}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          t.score >= 80
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : t.score >= 60
                            ? "bg-gradient-to-r from-indigo-500 to-indigo-400"
                            : t.score >= 40
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                            : "bg-gradient-to-r from-gray-600 to-gray-500"
                        }`}
                        style={{ width: `${t.score}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium w-8 text-right ${
                        t.score >= 80
                          ? "text-emerald-400"
                          : t.score >= 60
                          ? "text-indigo-400"
                          : "text-gray-400"
                      }`}
                    >
                      {t.score}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-400">최적</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-xs text-gray-400">좋음</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs text-gray-400">보통</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gray-600" />
                  <span className="text-xs text-gray-400">낮음</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">최근 활동 로그</h2>
              {recentLogs.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {recentLogs.slice(0, 20).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 py-2 border-b border-gray-700/30">
                      <span className={`w-2 h-2 rounded-full ${
                        log.status === "success" ? "bg-emerald-500" : log.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                      }`} />
                      <span className="text-xs text-gray-400 w-16">
                        {log.type === "follow" ? "팔로우" : log.type === "unfollow" ? "언팔로우" : log.type === "like" ? "좋아요" : "댓글"}
                      </span>
                      <span className="text-xs text-white flex-1 truncate">@{log.target}</span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(log.createdAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">아직 활동 로그가 없습니다</p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">아직 분석 데이터가 없습니다</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Instagram 계정을 추가하고 자동화를 실행하면 여기에 성과 데이터가 표시됩니다.
          </p>
        </div>
      )}

      {/* Account Performance Comparison */}
      {accounts.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">계정별 현황</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-700">
                  <th className="pb-3 pr-4">계정</th>
                  <th className="pb-3 pr-4">팔로워</th>
                  <th className="pb-3 pr-4">팔로잉</th>
                  <th className="pb-3">{period} 팔로워 증가</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => {
                  const accAnalytics = filtered.filter((a) => a.instaAccountId === acc.id);
                  const accGained = accAnalytics.reduce((s, a) => s + a.followersGained, 0);
                  return (
                    <tr key={acc.id} className="border-b border-gray-700/50">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                            {acc.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-white">@{acc.username}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-gray-300">
                        {acc.followers.toLocaleString()}
                      </td>
                      <td className="py-4 pr-4 text-sm text-gray-300">
                        {acc.following.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={`text-sm font-medium ${accGained > 0 ? "text-emerald-400" : "text-gray-400"}`}>
                          {accGained > 0 ? `+${accGained.toLocaleString()}` : "0"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
