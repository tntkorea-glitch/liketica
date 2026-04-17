import { prisma } from "./prisma";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

type SendResult = { ok: true } | { ok: false; error: string };

async function sendViaResend(opts: EmailOptions): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "noreply@liketica.com";
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not set" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown resend error" };
  }
}

async function sendViaSmtp(opts: EmailOptions): Promise<SendResult> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { ok: false, error: "SMTP env vars not set" };
  }

  try {
    // nodemailer is an optional peer dep — type it as unknown so TS doesn't require its types
    const mod = (await import("nodemailer" as string).catch(() => null)) as
      | { default: { createTransport: (opts: unknown) => { sendMail: (opts: unknown) => Promise<unknown> } } }
      | null;
    if (!mod) return { ok: false, error: "nodemailer not installed" };
    const transporter = mod.default.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || SMTP_USER,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown smtp error" };
  }
}

async function sendEmail(opts: EmailOptions): Promise<SendResult> {
  if (process.env.RESEND_API_KEY) return sendViaResend(opts);
  if (process.env.SMTP_HOST) return sendViaSmtp(opts);
  return { ok: false, error: "no email provider configured" };
}

async function logNotification(
  userId: string,
  type: string,
  subject: string,
  message: string,
  email: string,
  result: SendResult
) {
  await prisma.notificationLog.create({
    data: {
      userId,
      type,
      subject,
      message,
      email,
      status: result.ok ? "sent" : "failed",
    },
  });
}

export async function notifyUser(
  userId: string,
  type: "error" | "success" | "daily",
  subject: string,
  message: string
): Promise<SendResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user?.email) return { ok: false, error: "user has no email" };

  const pref = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  if (pref) {
    if (!pref.emailEnabled) return { ok: false, error: "email disabled" };
    if (type === "error" && !pref.notifyOnError) return { ok: false, error: "error notifications off" };
    if (type === "success" && !pref.notifyOnSuccess) return { ok: false, error: "success notifications off" };
    if (type === "daily" && !pref.notifyDailyReport) return { ok: false, error: "daily report off" };
  }

  const text = message;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px">
    <h2 style="color:#a78bfa;margin:0 0 16px">${subject}</h2>
    <p style="white-space:pre-wrap;line-height:1.6">${message.replace(/</g, "&lt;")}</p>
    <hr style="border:none;border-top:1px solid #334155;margin:24px 0" />
    <p style="font-size:12px;color:#64748b">Liketica — Instagram 자동화</p>
  </div>`;

  const result = await sendEmail({ to: user.email, subject: `[Liketica] ${subject}`, text, html });
  await logNotification(userId, type, subject, message, user.email, result);
  return result;
}

export async function notifyError(userId: string, accountUsername: string, error: string) {
  return notifyUser(
    userId,
    "error",
    `자동화 오류: @${accountUsername}`,
    `계정 @${accountUsername}에서 자동화 실행 중 오류가 발생했습니다.\n\n${error}`
  );
}

interface AccountDailyLine {
  username: string;
  follows: number;
  unfollows: number;
  likes: number;
  comments: number;
  errors: number;
}

function formatDailyReport(dateLabel: string, lines: AccountDailyLine[]) {
  const totals = lines.reduce(
    (acc, l) => {
      acc.follows += l.follows;
      acc.unfollows += l.unfollows;
      acc.likes += l.likes;
      acc.comments += l.comments;
      acc.errors += l.errors;
      return acc;
    },
    { follows: 0, unfollows: 0, likes: 0, comments: 0, errors: 0 }
  );

  const text = [
    `${dateLabel} 자동화 성과`,
    "",
    `총 팔로우: ${totals.follows}`,
    `총 언팔로우: ${totals.unfollows}`,
    `총 좋아요: ${totals.likes}`,
    `총 댓글: ${totals.comments}`,
    `총 오류: ${totals.errors}`,
    "",
    "계정별:",
    ...lines.map(
      (l) =>
        `  @${l.username} — follow ${l.follows} / unfollow ${l.unfollows} / like ${l.likes} / comment ${l.comments} / error ${l.errors}`
    ),
  ].join("\n");

  return { text, totals };
}

export async function sendDailyReport(userId: string, rangeStart: Date, rangeEnd: Date) {
  const accounts = await prisma.instaAccount.findMany({
    where: { userId },
    select: { id: true, username: true },
  });
  if (accounts.length === 0) return { ok: false as const, error: "no accounts" };

  const accountIds = accounts.map((a) => a.id);

  const analytics = await prisma.analyticsDaily.findMany({
    where: { instaAccountId: { in: accountIds }, date: { gte: rangeStart, lt: rangeEnd } },
  });

  const errorCounts = await prisma.activityLog.groupBy({
    by: ["instaAccountId"],
    where: {
      instaAccountId: { in: accountIds },
      status: "failed",
      createdAt: { gte: rangeStart, lt: rangeEnd },
    },
    _count: { _all: true },
  });
  const errorsByAccount = new Map(errorCounts.map((e) => [e.instaAccountId, e._count._all]));

  const lines: AccountDailyLine[] = accounts.map((a) => {
    const rows = analytics.filter((r) => r.instaAccountId === a.id);
    const sum = rows.reduce(
      (acc, r) => ({
        follows: acc.follows + r.follows,
        unfollows: acc.unfollows + r.unfollows,
        likes: acc.likes + r.likes,
        comments: acc.comments + r.comments,
      }),
      { follows: 0, unfollows: 0, likes: 0, comments: 0 }
    );
    return {
      username: a.username,
      ...sum,
      errors: errorsByAccount.get(a.id) ?? 0,
    };
  });

  const dateLabel = rangeStart.toISOString().slice(0, 10);
  const { text } = formatDailyReport(dateLabel, lines);
  return notifyUser(userId, "daily", `일일 리포트 (${dateLabel})`, text);
}
