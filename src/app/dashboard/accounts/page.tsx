"use client";

import { useState, useEffect, useCallback } from "react";

interface ProxyRef {
  id: string;
  label: string;
  host: string;
  port: number;
  protocol: string;
}

interface Account {
  id: string;
  username: string;
  followers: number;
  following: number;
  active: boolean;
  lastActivity: string | null;
  status: string;
  proxyId: string | null;
  proxyConfig: ProxyRef | null;
  twoFactorEnabled: boolean;
}

interface Proxy {
  id: string;
  label: string;
  host: string;
  port: number;
  protocol: string;
  active: boolean;
}

const statusLabels: Record<string, string> = {
  idle: "대기 중",
  running: "자동화 실행 중",
  paused: "일시정지",
  pending_2fa: "2FA 코드 입력 필요",
  error: "오류",
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newProxyId, setNewProxyId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [runningIds, setRunningIds] = useState<Set<string>>(new Set());
  const [twoFAAccount, setTwoFAAccount] = useState<Account | null>(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFASaving, setTwoFASaving] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");

  const fetchAccounts = useCallback(async () => {
    try {
      const [aRes, pRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/proxies"),
      ]);
      if (aRes.ok) setAccounts(await aRes.json());
      if (pRes.ok) setProxies(await pRes.json());
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const toggleAccount = async (id: string, currentActive: boolean) => {
    await fetch("/api/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !currentActive }),
    });
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? { ...acc, active: !acc.active, status: !acc.active ? "running" : "paused" }
          : acc
      )
    );
  };

  const deleteAccount = async (id: string) => {
    if (!confirm("정말 이 계정을 삭제하시겠습니까?")) return;
    await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const addAccount = async () => {
    if (!newUsername || !newPassword) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.replace(/^@/, ""),
          password: newPassword,
          proxyId: newProxyId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setAccounts((prev) => [data, ...prev]);
      setNewUsername("");
      setNewPassword("");
      setNewProxyId("");
      setShowModal(false);
    } catch {
      setError("계정 추가에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const submitTwoFA = async () => {
    if (!twoFAAccount || !twoFACode) return;
    setTwoFASaving(true);
    setTwoFAError("");
    try {
      const res = await fetch("/api/accounts/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: twoFAAccount.id, code: twoFACode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTwoFAError(data.error || "검증 실패");
        return;
      }
      setTwoFAAccount(null);
      setTwoFACode("");
      await fetchAccounts();
    } catch {
      setTwoFAError("요청 실패");
    } finally {
      setTwoFASaving(false);
    }
  };

  const changeProxy = async (accountId: string, proxyId: string) => {
    await fetch("/api/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: accountId, proxyId: proxyId || null }),
    });
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId
          ? {
              ...a,
              proxyId: proxyId || null,
              proxyConfig: proxies.find((p) => p.id === proxyId) || null,
            }
          : a
      )
    );
  };

  const toggleAutomation = async (accountId: string, isRunning: boolean) => {
    const action = isRunning ? "stop" : "start";
    try {
      const res = await fetch("/api/automation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, action }),
      });
      if (res.ok) {
        setRunningIds((prev) => {
          const next = new Set(prev);
          if (isRunning) next.delete(accountId);
          else next.add(accountId);
          return next;
        });
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId
              ? { ...acc, status: isRunning ? "idle" : "running" }
              : acc
          )
        );
      }
    } catch (e) {
      console.error("자동화 토글 실패:", e);
    }
  };

  const formatLastActivity = (date: string | null) => {
    if (!date) return "없음";
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "방금";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

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
          <h1 className="text-2xl font-bold text-white">계정관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            인스타그램 계정을 추가하고 관리하세요
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          계정 추가
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">전체 계정</p>
          <p className="text-2xl font-bold text-white mt-1">{accounts.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">활성 계정</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {accounts.filter((a) => a.active).length}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">총 팔로워</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {accounts.reduce((a, b) => a + b.followers, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        {accounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-700 bg-gray-800/50">
                  <th className="px-5 py-3">계정</th>
                  <th className="px-5 py-3">상태</th>
                  <th className="px-5 py-3">팔로워</th>
                  <th className="px-5 py-3">팔로잉</th>
                  <th className="px-5 py-3">마지막 활동</th>
                  <th className="px-5 py-3">자동화</th>
                  <th className="px-5 py-3">활성화</th>
                  <th className="px-5 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {account.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">@{account.username}</p>
                          <p className="text-xs text-gray-500">{statusLabels[account.status] || account.status}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          account.active
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-600/30 text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            account.active ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
                          }`}
                        />
                        {account.active ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {account.followers.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {account.following.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {formatLastActivity(account.lastActivity)}
                    </td>
                    <td className="px-5 py-4">
                      {account.active && (
                        <button
                          onClick={() => toggleAutomation(account.id, account.status === "running" || runningIds.has(account.id))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            account.status === "running" || runningIds.has(account.id)
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          }`}
                        >
                          {account.status === "running" || runningIds.has(account.id) ? "중지" : "시작"}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleAccount(account.id, account.active)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          account.active ? "bg-indigo-600" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            account.active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => deleteAccount(account.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="text-lg mb-2">등록된 계정이 없습니다</p>
            <p className="text-sm">위의 &quot;계정 추가&quot; 버튼을 클릭하여 인스타그램 계정을 추가하세요</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">계정 추가</h2>
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="p-1 rounded-lg hover:bg-gray-700 text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  인스타그램 아이디
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="username"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-400">
                  계정 정보는 암호화되어 안전하게 저장됩니다. 2단계 인증이 설정된 경우 추가 인증이 필요할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={addAccount}
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? "추가 중..." : "추가하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
