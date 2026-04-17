"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  hasPassword: boolean;
  createdAt: string;
}

export default function AccountPage() {
  const { update: updateSession } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/user/profile");
    if (res.ok) {
      const data: Profile = await res.json();
      setProfile(data);
      setName(data.name || "");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveName = async () => {
    if (!name.trim()) {
      setNameMsg({ ok: false, text: "이름을 입력하세요" });
      return;
    }
    setSavingName(true);
    setNameMsg(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNameMsg({ ok: false, text: data.error || "저장 실패" });
        return;
      }
      setNameMsg({ ok: true, text: "저장되었습니다" });
      setProfile((p) => (p ? { ...p, name: data.name } : p));
      await updateSession();
    } finally {
      setSavingName(false);
      setTimeout(() => setNameMsg(null), 4000);
    }
  };

  const savePassword = async () => {
    setPwMsg(null);
    if (newPassword.length < 8) {
      setPwMsg({ ok: false, text: "새 비밀번호는 8자 이상이어야 합니다" });
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPwMsg({ ok: false, text: "비밀번호 확인이 일치하지 않습니다" });
      return;
    }
    if (profile?.hasPassword && !currentPassword) {
      setPwMsg({ ok: false, text: "현재 비밀번호를 입력하세요" });
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ ok: false, text: data.error || "변경 실패" });
        return;
      }
      setPwMsg({ ok: true, text: "비밀번호가 변경되었습니다" });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setProfile((p) => (p ? { ...p, hasPassword: true } : p));
    } finally {
      setSavingPw(false);
      setTimeout(() => setPwMsg(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">내 프로필</h1>
        <p className="text-sm text-gray-400 mt-1">계정 이름과 비밀번호를 변경할 수 있습니다</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">기본 정보</h2>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">이메일</label>
          <input
            type="email"
            value={profile?.email || ""}
            disabled
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-[11px] text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {nameMsg && (
          <div
            className={`rounded-lg px-3 py-2 text-xs ${
              nameMsg.ok
                ? "bg-green-500/20 border border-green-500/40 text-green-200"
                : "bg-red-500/20 border border-red-500/40 text-red-200"
            }`}
          >
            {nameMsg.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={saveName}
            disabled={savingName}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {savingName ? "저장 중..." : "이름 저장"}
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">비밀번호 {profile?.hasPassword ? "변경" : "설정"}</h2>
          {!profile?.hasPassword && (
            <p className="text-xs text-gray-400 mt-1">
              현재 소셜 로그인만 사용 중입니다. 비밀번호를 설정하면 이메일로도 로그인할 수 있습니다.
            </p>
          )}
        </div>

        {profile?.hasPassword && (
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">새 비밀번호 (8자 이상)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">새 비밀번호 확인</label>
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {pwMsg && (
          <div
            className={`rounded-lg px-3 py-2 text-xs ${
              pwMsg.ok
                ? "bg-green-500/20 border border-green-500/40 text-green-200"
                : "bg-red-500/20 border border-red-500/40 text-red-200"
            }`}
          >
            {pwMsg.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={savePassword}
            disabled={savingPw}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {savingPw ? "저장 중..." : profile?.hasPassword ? "비밀번호 변경" : "비밀번호 설정"}
          </button>
        </div>
      </div>
    </div>
  );
}
