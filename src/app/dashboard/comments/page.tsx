"use client";

import { useState, useEffect, useCallback } from "react";

interface CommentGroup {
  id: string;
  name: string;
  comments: string[];
}

const initialGroups: CommentGroup[] = [
  {
    id: "1",
    name: "일반 인사",
    comments: [
      "좋은 사진이네요!",
      "너무 예뻐요 :)",
      "멋진 피드네요!",
      "오늘도 좋은 하루 보내세요!",
      "항상 응원합니다!",
      "분위기 너무 좋아요~",
      "감성적이네요!",
    ],
  },
  {
    id: "2",
    name: "뷰티/패션",
    comments: [
      "스타일 너무 좋아요!",
      "어디 브랜드예요?",
      "색감이 예술이네요!",
      "피부 진짜 좋으시다..",
      "이 룩 너무 예뻐요!",
      "메이크업 정보 좀 알려주세요!",
      "센스가 남다르시네요!",
      "오늘 코디 최고예요!",
    ],
  },
  {
    id: "3",
    name: "음식/카페",
    comments: [
      "맛있겠다! 어디예요?",
      "여기 가보고 싶네요!",
      "플레이팅 예술이네요!",
      "위치 좀 알려주세요~",
      "분위기 좋은 곳이네요!",
      "메뉴 추천 부탁드려요!",
      "다음에 꼭 가봐야겠어요!",
      "사진만 봐도 맛있어 보여요!",
    ],
  },
];

export default function CommentsPage() {
  const [groups, setGroups] = useState<CommentGroup[]>(initialGroups);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const addComment = (groupId: string) => {
    if (!newComment) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, comments: [...g.comments, newComment] } : g
      )
    );
    setNewComment("");
  };

  const removeComment = (groupId: string, commentIndex: number) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, comments: g.comments.filter((_, i) => i !== commentIndex) }
          : g
      )
    );
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const addGroup = () => {
    if (!newGroupName) return;
    const group: CommentGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      comments: [],
    };
    setGroups((prev) => [...prev, group]);
    setNewGroupName("");
    setShowAddGroup(false);
    setEditingGroup(group.id);
  };

  const handleAiGenerate = (groupId: string) => {
    setAiGenerating(true);
    setTimeout(() => {
      const aiComments = [
        "완전 공감가는 포스팅이에요!",
        "오늘도 좋은 콘텐츠 감사해요!",
        "팔로우 했어요! 소통해요~",
        "진짜 대박이네요!",
        "이런 감성 너무 좋아요!",
      ];
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, comments: [...g.comments, ...aiComments] } : g
        )
      );
      setAiGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">댓글 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            자동 댓글 템플릿을 그룹별로 관리하세요
          </p>
        </div>
        <button
          onClick={() => setShowAddGroup(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          그룹 추가
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">댓글 그룹</p>
          <p className="text-2xl font-bold text-white mt-1">{groups.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">전체 템플릿</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {groups.reduce((a, g) => a + g.comments.length, 0)}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">오늘 사용된 댓글</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">8</p>
        </div>
      </div>

      {/* Comment Groups */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
          >
            {/* Group Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{group.name}</h3>
                  <p className="text-xs text-gray-500">{group.comments.length}개 템플릿</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAiGenerate(group.id)}
                  disabled={aiGenerating}
                  className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <svg className={`w-3.5 h-3.5 ${aiGenerating ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                  AI 생성
                </button>
                <button
                  onClick={() => setEditingGroup(editingGroup === group.id ? null : group.id)}
                  className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Comments list */}
            <div className="px-5 py-3">
              <div className="space-y-2">
                {group.comments.map((comment, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 bg-gray-900/50 rounded-lg group"
                  >
                    <p className="text-sm text-gray-300">{comment}</p>
                    {editingGroup === group.id && (
                      <button
                        onClick={() => removeComment(group.id, i)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add comment */}
              {editingGroup === group.id && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addComment(group.id)}
                    placeholder="새 댓글 템플릿 입력..."
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => addComment(group.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    추가
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Group Modal */}
      {showAddGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">댓글 그룹 추가</h2>
              <button
                onClick={() => setShowAddGroup(false)}
                className="p-1 rounded-lg hover:bg-gray-700 text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">그룹 이름</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="예: 여행 댓글"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddGroup(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={addGroup}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
