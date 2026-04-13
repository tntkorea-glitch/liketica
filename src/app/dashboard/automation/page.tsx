"use client";

import { useState, useEffect, useCallback } from "react";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-indigo-600" : "bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Slider({
  value,
  min,
  max,
  onChange,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${pct}%, #374151 ${pct}%, #374151 100%)`,
          }}
        />
      </div>
      <span className="text-sm font-medium text-indigo-400 w-16 text-right">
        {value}
        {unit || ""}
      </span>
    </div>
  );
}

export default function AutomationPage() {
  // Follow settings
  const [followEnabled, setFollowEnabled] = useState(true);
  const [maxFollow, setMaxFollow] = useState(50);
  const [followDelay, setFollowDelay] = useState(30);
  const [followRandomDelay, setFollowRandomDelay] = useState(true);
  const [followRandomMin, setFollowRandomMin] = useState(20);
  const [followRandomMax, setFollowRandomMax] = useState(60);

  // Unfollow settings
  const [unfollowEnabled, setUnfollowEnabled] = useState(true);
  const [maxUnfollow, setMaxUnfollow] = useState(30);
  const [unfollowDelay, setUnfollowDelay] = useState(45);
  const [excludeFriends, setExcludeFriends] = useState(true);

  // Like settings
  const [likeEnabled, setLikeEnabled] = useState(true);
  const [maxLike, setMaxLike] = useState(50);
  const [likeDelay, setLikeDelay] = useState(15);

  // Comment settings
  const [commentEnabled, setCommentEnabled] = useState(true);
  const [maxComment, setMaxComment] = useState(10);
  const [commentNoFollow, setCommentNoFollow] = useState(false);

  // Safety settings
  const [detectionDelay, setDetectionDelay] = useState(300);
  const [dailyLimit, setDailyLimit] = useState(500);
  const [autoPause, setAutoPause] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">자동화 설정</h1>
          <p className="text-sm text-gray-400 mt-1">
            각 자동화 기능의 세부 설정을 조정하세요
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          설정 저장
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follow Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">팔로우 설정</h2>
                <p className="text-xs text-gray-500">자동 팔로우 동작 설정</p>
              </div>
            </div>
            <Toggle enabled={followEnabled} onChange={() => setFollowEnabled(!followEnabled)} />
          </div>

          <div className={`space-y-5 ${!followEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300">하루 최대 팔로우 수</label>
              </div>
              <Slider value={maxFollow} min={10} max={100} onChange={setMaxFollow} unit="회" />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">팔로우 간 대기시간</label>
              <Slider value={followDelay} min={10} max={120} onChange={setFollowDelay} unit="초" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-300">랜덤 딜레이</label>
                <p className="text-xs text-gray-500">자연스러운 동작을 위한 랜덤 지연</p>
              </div>
              <Toggle enabled={followRandomDelay} onChange={() => setFollowRandomDelay(!followRandomDelay)} />
            </div>
            {followRandomDelay && (
              <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-indigo-500/30">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">최소 (초)</label>
                  <Slider value={followRandomMin} min={5} max={60} onChange={setFollowRandomMin} unit="초" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">최대 (초)</label>
                  <Slider value={followRandomMax} min={30} max={180} onChange={setFollowRandomMax} unit="초" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unfollow Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">언팔로우 설정</h2>
                <p className="text-xs text-gray-500">자동 언팔로우 동작 설정</p>
              </div>
            </div>
            <Toggle enabled={unfollowEnabled} onChange={() => setUnfollowEnabled(!unfollowEnabled)} />
          </div>

          <div className={`space-y-5 ${!unfollowEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">하루 최대 언팔로우 수</label>
              <Slider value={maxUnfollow} min={10} max={100} onChange={setMaxUnfollow} unit="회" />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">언팔로우 후 대기시간</label>
              <Slider value={unfollowDelay} min={10} max={120} onChange={setUnfollowDelay} unit="초" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-300">친구 제외</label>
                <p className="text-xs text-gray-500">맞팔로우 중인 계정은 언팔 제외</p>
              </div>
              <Toggle enabled={excludeFriends} onChange={() => setExcludeFriends(!excludeFriends)} />
            </div>
          </div>
        </div>

        {/* Like Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">좋아요 설정</h2>
                <p className="text-xs text-gray-500">자동 좋아요 동작 설정</p>
              </div>
            </div>
            <Toggle enabled={likeEnabled} onChange={() => setLikeEnabled(!likeEnabled)} />
          </div>

          <div className={`space-y-5 ${!likeEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">하루 최대 좋아요 수</label>
              <Slider value={maxLike} min={10} max={100} onChange={setMaxLike} unit="회" />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">게시물당 대기시간</label>
              <Slider value={likeDelay} min={5} max={60} onChange={setLikeDelay} unit="초" />
            </div>
          </div>
        </div>

        {/* Comment Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">댓글 설정</h2>
                <p className="text-xs text-gray-500">자동 댓글 동작 설정</p>
              </div>
            </div>
            <Toggle enabled={commentEnabled} onChange={() => setCommentEnabled(!commentEnabled)} />
          </div>

          <div className={`space-y-5 ${!commentEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">하루 최대 댓글 수</label>
              <Slider value={maxComment} min={5} max={50} onChange={setMaxComment} unit="회" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-300">댓글 시 팔로우 제외</label>
                <p className="text-xs text-gray-500">댓글 작성 시 팔로우하지 않음</p>
              </div>
              <Toggle enabled={commentNoFollow} onChange={() => setCommentNoFollow(!commentNoFollow)} />
            </div>
          </div>
        </div>
      </div>

      {/* Safety Settings */}
      <div className="bg-gray-800/50 border border-indigo-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              안전 설정
              <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                PRO 전용
              </span>
            </h2>
            <p className="text-xs text-gray-500">계정 보호를 위한 고급 안전 설정</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">인스타그램 감지 대기시간</label>
            <Slider value={detectionDelay} min={60} max={600} onChange={setDetectionDelay} unit="초" />
            <p className="text-xs text-gray-500 mt-1">감지 시 자동으로 대기합니다</p>
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">일일 총 작업 제한</label>
            <Slider value={dailyLimit} min={100} max={1000} onChange={setDailyLimit} unit="회" />
            <p className="text-xs text-gray-500 mt-1">모든 작업 합산 일일 한도</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <label className="text-sm text-gray-300">자동 일시정지</label>
              <p className="text-xs text-gray-500 mt-1">
                인스타그램 감지 시 모든 작업을<br />자동으로 일시정지합니다
              </p>
            </div>
            <Toggle enabled={autoPause} onChange={() => setAutoPause(!autoPause)} />
          </div>
        </div>
      </div>
    </div>
  );
}
