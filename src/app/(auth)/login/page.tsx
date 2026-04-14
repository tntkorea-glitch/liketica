"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-md">
            B
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">인스타봇 프로</span>
        </Link>

        <div className="bg-white rounded-2xl p-8 border-2 border-slate-900 shadow-xl">
          <h1 className="text-2xl font-black text-center mb-1 text-slate-900">로그인</h1>
          <p className="text-center text-sm text-slate-500 mb-6">3초 만에 시작하세요</p>

          {/* Social buttons */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white border-2 border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-slate-900 font-bold rounded-lg transition text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.002-.001 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              구글로 로그인
            </button>

            <button
              type="button"
              onClick={() => alert("카카오 로그인은 준비 중입니다")}
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] hover:brightness-95 text-[#3c1e1e] font-bold rounded-lg transition text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67l-.96 3.56c-.08.31.27.56.54.38l4.24-2.82c.49.05 1 .08 1.52.08 5.52 0 10-3.58 10-7.87S17.52 3 12 3z" />
              </svg>
              카카오로 로그인
            </button>

            <button
              type="button"
              onClick={() => alert("네이버 로그인은 준비 중입니다")}
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] hover:brightness-95 text-white font-bold rounded-lg transition text-sm"
            >
              <span className="font-black text-base leading-none">N</span>
              네이버로 로그인
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">또는 이메일로</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 text-white font-black rounded-lg transition disabled:opacity-50 text-sm shadow-md"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-slate-500">계정이 없으신가요? </span>
            <Link href="/register" className="text-orange-600 hover:underline font-bold">
              회원가입
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-900">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
