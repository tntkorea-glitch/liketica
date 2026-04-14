"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const bootSequence = [
  "$ instabot init --project=@yourname",
  "[OK] Connected to Instagram API",
  "[OK] Loaded 1,847 target hashtags",
  "[OK] Safety profile: HUMAN_LIKE_V3",
  "",
  "$ instabot start --tag=#cafe --tag=#seoul --limit=50",
  "▶ Engine started · PID 4127",
  "",
];

const logStream = [
  { t: "00:00:03", type: "FOLLOW", msg: "@minji_cafe · followed (127 today)" },
  { t: "00:00:07", type: "LIKE", msg: "post/C3k9p_x · liked (432 today)" },
  { t: "00:00:12", type: "AI_CMT", msg: "\"사진 톤 너무 좋네요 🙌\" · posted" },
  { t: "00:00:19", type: "LIKE", msg: "post/C3m1q2x · liked (433 today)" },
  { t: "00:00:26", type: "FOLLOW", msg: "@daily_grind · followed (128 today)" },
  { t: "00:00:33", type: "UNFOLLOW", msg: "@spam_acct99 · removed (ratio 1.08)" },
  { t: "00:00:41", type: "AI_CMT", msg: "\"이 카페 어디예요? 가보고 싶어요\" · posted" },
  { t: "00:00:48", type: "STAT", msg: "followers: +340% (30d) · engagement: +89%" },
];

function useTyped(lines: string[], speed = 18) {
  const [out, setOut] = useState<string[]>([]);
  useEffect(() => {
    let i = 0, j = 0;
    const id = setInterval(() => {
      if (i >= lines.length) { clearInterval(id); return; }
      const cur = lines[i];
      j++;
      setOut((prev) => {
        const copy = [...prev];
        copy[i] = cur.slice(0, j);
        return copy;
      });
      if (j >= cur.length) { i++; j = 0; }
    }, speed);
    return () => clearInterval(id);
  }, [lines, speed]);
  return out;
}

function typeColor(t: string) {
  return {
    FOLLOW: "text-sky-400",
    LIKE: "text-pink-400",
    AI_CMT: "text-violet-400",
    UNFOLLOW: "text-amber-400",
    STAT: "text-emerald-400",
  }[t] || "text-emerald-400";
}

export default function TerminalSkin() {
  const typed = useTyped(bootSequence, 12);
  const [visibleLogs, setVisibleLogs] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisibleLogs((v) => (v >= logStream.length ? v : v + 1));
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-black text-emerald-400 font-mono p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #22c55e 2px, #22c55e 3px)",
      }} />

      <div className="max-w-6xl mx-auto relative">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-3 text-emerald-600/70">instabot@prod:~ — zsh — 120×36</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/skin" className="text-emerald-600/70 hover:text-emerald-400">← /skin</Link>
            <Link href="/dashboard" className="border border-emerald-500/60 px-3 py-1 hover:bg-emerald-500 hover:text-black transition">./start.sh</Link>
          </div>
        </div>

        {/* ASCII hero */}
        <pre className="text-emerald-500 text-[10px] sm:text-sm leading-tight mb-6 whitespace-pre overflow-x-auto">
{`  ___           _        ____        _     ____
 |_ _|_ __  ___| |_ __ _| __ )  ___ | |_  |  _ \\ _ __ ___
  | || '_ \\/ __| __/ _\` |  _ \\ / _ \\| __| | |_) | '__/ _ \\
  | || | | \\__ \\ || (_| | |_) | (_) | |_  |  __/| | | (_) |
 |___|_| |_|___/\\__\\__,_|____/ \\___/ \\__| |_|   |_|  \\___/`}
        </pre>
        <p className="text-emerald-300/70 text-sm mb-8">&gt; Instagram growth, on the command line. v3.2.1</p>

        {/* Terminal typing */}
        <div className="border border-emerald-900 bg-emerald-950/30 p-5 rounded mb-8 text-sm min-h-[200px]">
          {typed.map((line, i) => {
            if (line?.startsWith("[OK]")) return <p key={i} className="text-emerald-500"><span className="text-emerald-600">{line.slice(0, 4)}</span>{line.slice(4)}</p>;
            if (line?.startsWith("$")) return <p key={i} className="text-white">{line}<span className="animate-pulse">█</span></p>;
            if (line?.startsWith("▶")) return <p key={i} className="text-amber-400">{line}</p>;
            return <p key={i}>{line || "\u00A0"}</p>;
          })}
        </div>

        {/* Live log stream */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-emerald-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>tail -f /var/log/instabot.log</span>
          </div>
          <div className="border border-emerald-900 bg-black p-5 rounded text-sm space-y-1 min-h-[260px]">
            {logStream.slice(0, visibleLogs).map((log, i) => (
              <p key={i} className="text-emerald-600/90">
                <span className="text-emerald-700">[{log.t}]</span>{" "}
                <span className={typeColor(log.type)}>{log.type.padEnd(8)}</span>{" "}
                <span className="text-emerald-300">{log.msg}</span>
              </p>
            ))}
            {visibleLogs < logStream.length && <p className="text-emerald-500 animate-pulse">█</p>}
          </div>
        </div>

        {/* Stats as ASCII chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-emerald-900 p-4 rounded">
            <p className="text-xs text-emerald-700 mb-2">--followers</p>
            <p className="text-3xl text-emerald-400">+340%</p>
            <pre className="text-[9px] text-emerald-600 mt-2">{`▁▂▂▃▄▅▆▇█`}</pre>
          </div>
          <div className="border border-emerald-900 p-4 rounded">
            <p className="text-xs text-emerald-700 mb-2">--engagement</p>
            <p className="text-3xl text-emerald-400">+89%</p>
            <pre className="text-[9px] text-emerald-600 mt-2">{`▂▃▃▄▅▅▇██`}</pre>
          </div>
          <div className="border border-emerald-900 p-4 rounded">
            <p className="text-xs text-emerald-700 mb-2">--uptime</p>
            <p className="text-3xl text-emerald-400">99.98%</p>
            <pre className="text-[9px] text-emerald-600 mt-2">{`█████████`}</pre>
          </div>
        </div>

        {/* Pricing as man page */}
        <div className="border border-emerald-900 p-5 rounded mb-8">
          <p className="text-xs text-emerald-600 mb-3">$ man instabot-pricing</p>
          <div className="space-y-3 text-sm">
            <p><span className="text-white">--basic</span>      <span className="text-emerald-600">FREE</span>      1 account, 50 likes/day</p>
            <p><span className="text-white">--pro</span>        <span className="text-amber-400">₩49,000/mo</span>   3 accounts, unlimited, AI comments <span className="text-emerald-500">[recommended]</span></p>
            <p><span className="text-white">--business</span>   <span className="text-emerald-600">₩99,000/mo</span>   10 accounts, API access, dedicated manager</p>
          </div>
          <Link href="/dashboard" className="inline-block mt-5 border border-emerald-500 px-4 py-2 text-sm hover:bg-emerald-500 hover:text-black transition">
            $ instabot install --plan=pro
          </Link>
        </div>

        <p className="text-xs text-emerald-700 text-center">Skin 03 — Terminal / Dev Console · EOF</p>
      </div>
    </main>
  );
}
