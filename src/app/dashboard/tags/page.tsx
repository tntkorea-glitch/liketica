"use client";

import { useState, useEffect, useCallback } from "react";

interface TagGroup {
  id: string;
  name: string;
  tags: string[];
  followEnabled: boolean;
  likeEnabled: boolean;
  commentEnabled: boolean;
}

export default function TagsPage() {
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [excludeTags, setExcludeTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch("/api/tags");
      if (res.ok) setTagGroups(await res.json());
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTags(); }, [fetchTags]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupTags, setNewGroupTags] = useState("");
  const [newExcludeTag, setNewExcludeTag] = useState("");

  const toggleGroupSetting = async (id: string, key: "followEnabled" | "likeEnabled" | "commentEnabled") => {
    const group = tagGroups.find((g) => g.id === id);
    if (!group) return;
    setTagGroups((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: !g[key] } : g)));
    await fetch("/api/tags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [key]: !group[key] }),
    });
  };

  const deleteGroup = async (id: string) => {
    setTagGroups((prev) => prev.filter((g) => g.id !== id));
    await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
  };

  const addGroup = async () => {
    if (!newGroupName || !newGroupTags) return;
    const tags = newGroupTags.split(",").map((t) => t.trim()).filter(Boolean);
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newGroupName, tags }),
    });
    if (res.ok) {
      const group = await res.json();
      setTagGroups((prev) => [group, ...prev]);
    }
    setNewGroupName("");
    setNewGroupTags("");
    setShowAddModal(false);
  };

  const addExcludeTag = () => {
    if (!newExcludeTag || excludeTags.includes(newExcludeTag)) return;
    setExcludeTags((prev) => [...prev, newExcludeTag]);
    setNewExcludeTag("");
  };

  const removeExcludeTag = (tag: string) => {
    setExcludeTags((prev) => prev.filter((t) => t !== tag));
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
          <h1 className="text-2xl font-bold text-white">태그 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            해시태그 그룹을 만들어 타겟 사용자를 설정하세요
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          태그 그룹 추가
        </button>
      </div>

      {/* Tag Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {tagGroups.map((group) => (
          <div
            key={group.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{group.name}</h3>
              <button
                onClick={() => deleteGroup(group.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {group.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-indigo-500/15 text-indigo-400 rounded-lg text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Toggle actions */}
            <div className="space-y-2.5 pt-3 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">팔로우</span>
                <button
                  onClick={() => toggleGroupSetting(group.id, "followEnabled")}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    group.followEnabled ? "bg-indigo-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      group.followEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">좋아요</span>
                <button
                  onClick={() => toggleGroupSetting(group.id, "likeEnabled")}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    group.likeEnabled ? "bg-pink-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      group.likeEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">댓글</span>
                <button
                  onClick={() => toggleGroupSetting(group.id, "commentEnabled")}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    group.commentEnabled ? "bg-emerald-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      group.commentEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exclude Tags */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">제외 태그</h2>
            <p className="text-xs text-gray-500">이 태그가 포함된 게시물은 자동화 대상에서 제외됩니다</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {excludeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 text-red-400 rounded-lg text-xs font-medium group"
            >
              #{tag}
              <button
                onClick={() => removeExcludeTag(tag)}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newExcludeTag}
            onChange={(e) => setNewExcludeTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExcludeTag()}
            placeholder="제외할 태그 입력"
            className="flex-1 max-w-xs bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={addExcludeTag}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            추가
          </button>
        </div>
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">태그 그룹 추가</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-gray-700 text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">그룹 이름</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="예: 패션그룹"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  태그 (쉼표로 구분)
                </label>
                <textarea
                  value={newGroupTags}
                  onChange={(e) => setNewGroupTags(e.target.value)}
                  placeholder="패션, 데일리룩, ootd, 코디"
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
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
