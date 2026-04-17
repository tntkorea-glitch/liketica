import { prisma } from "./prisma";
import * as ig from "./instagram";
import { TwoFactorRequiredError } from "./instagram";
import type { InstaCredentials, ActionResult } from "./instagram";
import type { IgApiClient } from "instagram-private-api";
import { buildProxyUrl } from "./proxy-utils";
import { decrypt } from "./crypto";
import { notifyError } from "./notifications";

// In-memory running state (per-process)
const runningAccounts = new Map<string, { running: boolean; stats: RunStats }>();

interface RunStats {
  follows: number;
  unfollows: number;
  likes: number;
  comments: number;
  errors: number;
  startedAt: Date;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(baseMs: number, variance = 0.3): number {
  const min = baseMs * (1 - variance);
  const max = baseMs * (1 + variance);
  return Math.floor(Math.random() * (max - min) + min);
}

async function logActivity(
  instaAccountId: string,
  type: string,
  result: ActionResult
) {
  await prisma.activityLog.create({
    data: {
      instaAccountId,
      type,
      target: result.target,
      status: result.success ? "success" : "failed",
      message: result.message,
    },
  });
}

async function updateAnalytics(
  instaAccountId: string,
  type: string,
  success: boolean
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.analyticsDaily.findUnique({
    where: { instaAccountId_date: { instaAccountId, date: today } },
  });

  if (existing) {
    const data: Record<string, number> = {};
    if (type === "follow" && success) data.follows = existing.follows + 1;
    if (type === "unfollow" && success) data.unfollows = existing.unfollows + 1;
    if (type === "like" && success) data.likes = existing.likes + 1;
    if (type === "comment" && success) data.comments = existing.comments + 1;
    if (Object.keys(data).length > 0) {
      await prisma.analyticsDaily.update({
        where: { id: existing.id },
        data,
      });
    }
  } else {
    await prisma.analyticsDaily.create({
      data: {
        instaAccountId,
        date: today,
        follows: type === "follow" && success ? 1 : 0,
        unfollows: type === "unfollow" && success ? 1 : 0,
        likes: type === "like" && success ? 1 : 0,
        comments: type === "comment" && success ? 1 : 0,
      },
    });
  }
}

function isAccountRunning(accountId: string): boolean {
  return runningAccounts.get(accountId)?.running ?? false;
}

export function getAccountStatus(accountId: string) {
  const state = runningAccounts.get(accountId);
  if (!state) return { running: false, stats: null };
  return { running: state.running, stats: state.stats };
}

export function stopAccount(accountId: string) {
  const state = runningAccounts.get(accountId);
  if (state) state.running = false;
}

export async function runAutomation(userId: string, accountId: string) {
  if (isAccountRunning(accountId)) {
    return { error: "이미 실행 중입니다" };
  }

  // Load account + config
  const account = await prisma.instaAccount.findFirst({
    where: { id: accountId, userId },
    include: { proxyConfig: true },
  });
  if (!account) return { error: "계정을 찾을 수 없습니다" };

  const config = await prisma.automationConfig.findUnique({
    where: { userId },
  });
  if (!config) return { error: "자동화 설정이 없습니다" };

  const scheduleConfig = await prisma.scheduleConfig.findUnique({
    where: { userId },
  });

  // Load tag groups for targeting
  const tagGroups = await prisma.tagGroup.findMany({
    where: { userId },
  });

  // Load comment templates
  const commentGroups = await prisma.commentGroup.findMany({
    where: { userId },
  });

  const stats: RunStats = {
    follows: 0, unfollows: 0, likes: 0, comments: 0, errors: 0,
    startedAt: new Date(),
  };
  runningAccounts.set(accountId, { running: true, stats });

  // Update account status
  await prisma.instaAccount.update({
    where: { id: accountId },
    data: { status: "running" },
  });

  // Run automation in background (don't await)
  runLoop(account, config, scheduleConfig, tagGroups, commentGroups, stats, accountId).catch(
    (e) => console.error("Automation error:", e)
  );

  return { success: true, message: "자동화가 시작되었습니다" };
}

interface RunAccount {
  id: string;
  userId: string;
  username: string;
  password: string;
  proxy: string | null;
  proxyConfig: {
    protocol: string;
    host: string;
    port: number;
    username: string | null;
    password: string | null;
    active: boolean;
  } | null;
}

async function runLoop(
  account: RunAccount,
  config: {
    followEnabled: boolean; maxFollow: number; followDelay: number;
    unfollowEnabled: boolean; maxUnfollow: number; unfollowDelay: number;
    likeEnabled: boolean; maxLike: number; likeDelay: number;
    commentEnabled: boolean; maxComment: number;
    dailyLimit: number; autoPause: boolean; detectionDelay: number;
  },
  scheduleConfig: { schedule: string; tasks: string } | null,
  tagGroups: { tags: string; followEnabled: boolean; likeEnabled: boolean; commentEnabled: boolean }[],
  commentGroups: { comments: string }[],
  stats: RunStats,
  accountId: string
) {
  let client: IgApiClient;

  try {
    const proxyUrl =
      account.proxyConfig && account.proxyConfig.active
        ? buildProxyUrl(account.proxyConfig)
        : account.proxy || undefined;
    const creds: InstaCredentials = {
      username: account.username,
      password: account.password,
      proxy: proxyUrl,
    };
    client = await ig.login(creds);
  } catch (e) {
    console.error("Login failed:", e);
    runningAccounts.set(accountId, { running: false, stats });

    if (e instanceof TwoFactorRequiredError) {
      await prisma.instaAccount.update({
        where: { id: accountId },
        data: {
          status: "pending_2fa",
          twoFactorEnabled: true,
          twoFactorIdentifier: e.twoFactorIdentifier,
        },
      });
      await notifyError(
        account.userId,
        account.username,
        "2단계 인증 코드가 필요합니다. 계정 페이지에서 코드를 입력해 주세요."
      ).catch(() => {});
      return;
    }

    await prisma.instaAccount.update({
      where: { id: accountId },
      data: { status: "error" },
    });
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    await notifyError(account.userId, account.username, msg).catch(() => {});
    return;
  }

  // Parse task intervals from schedule
  const taskIntervals: Record<string, number> = {
    follow: config.followDelay,
    unfollow: config.unfollowDelay,
    like: config.likeDelay,
    comment: 60,
  };
  if (scheduleConfig?.tasks) {
    try {
      const tasks = JSON.parse(scheduleConfig.tasks);
      if (Array.isArray(tasks)) {
        for (const t of tasks) {
          if (t.id && t.interval) taskIntervals[t.id] = t.interval;
        }
      }
    } catch { /* ignore */ }
  }

  // Collect all tags
  const allTags: string[] = [];
  for (const group of tagGroups) {
    try {
      const tags = JSON.parse(group.tags);
      if (Array.isArray(tags)) allTags.push(...tags);
    } catch { /* ignore */ }
  }

  // Collect all comment templates
  const allComments: string[] = [];
  for (const group of commentGroups) {
    try {
      const comments = JSON.parse(group.comments);
      if (Array.isArray(comments)) allComments.push(...comments);
    } catch { /* ignore */ }
  }

  const totalDailyActions = () => stats.follows + stats.unfollows + stats.likes + stats.comments;

  while (isAccountRunning(accountId)) {
    // Check daily limit
    if (config.autoPause && totalDailyActions() >= config.dailyLimit) {
      console.log(`[${account.username}] Daily limit reached: ${config.dailyLimit}`);
      break;
    }

    // Check schedule (is current hour active?)
    if (scheduleConfig?.schedule) {
      try {
        const schedule = JSON.parse(scheduleConfig.schedule);
        const now = new Date();
        const dayIndex = (now.getDay() + 6) % 7; // Mon=0
        const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const daySchedule = schedule[dayKeys[dayIndex]];
        if (Array.isArray(daySchedule) && !daySchedule[now.getHours()]) {
          // Current hour is not active, wait and check again
          await delay(60000);
          continue;
        }
      } catch { /* ignore, run anyway */ }
    }

    // Pick a random tag for targeting
    const tag = allTags.length > 0
      ? allTags[Math.floor(Math.random() * allTags.length)].replace("#", "")
      : null;

    // Fetch posts from hashtag feed
    let posts: { mediaId: string; username: string }[] = [];
    if (tag) {
      try {
        posts = await ig.getHashtagFeed(client, tag, 10);
      } catch (e) {
        console.error("Feed fetch error:", e);
        stats.errors++;
        await delay(randomDelay(config.detectionDelay * 1000));
        continue;
      }
    }

    // Like posts
    if (config.likeEnabled && stats.likes < config.maxLike) {
      for (const post of posts) {
        if (!isAccountRunning(accountId)) break;
        if (stats.likes >= config.maxLike) break;

        const result = await ig.likePost(client, post.mediaId);
        await logActivity(accountId, "like", result);
        await updateAnalytics(accountId, "like", result.success);
        if (result.success) stats.likes++;
        else stats.errors++;

        await delay(randomDelay(taskIntervals.like * 1000));
      }
    }

    // Follow users from posts
    if (config.followEnabled && stats.follows < config.maxFollow) {
      for (const post of posts) {
        if (!isAccountRunning(accountId)) break;
        if (stats.follows >= config.maxFollow) break;

        const result = await ig.followUser(client, post.username);
        await logActivity(accountId, "follow", result);
        await updateAnalytics(accountId, "follow", result.success);
        if (result.success) stats.follows++;
        else stats.errors++;

        await delay(randomDelay(taskIntervals.follow * 1000));
      }
    }

    // Comment on posts
    if (config.commentEnabled && stats.comments < config.maxComment && allComments.length > 0) {
      for (const post of posts) {
        if (!isAccountRunning(accountId)) break;
        if (stats.comments >= config.maxComment) break;

        const comment = allComments[Math.floor(Math.random() * allComments.length)];
        const result = await ig.commentPost(client, post.mediaId, comment);
        await logActivity(accountId, "comment", result);
        await updateAnalytics(accountId, "comment", result.success);
        if (result.success) stats.comments++;
        else stats.errors++;

        await delay(randomDelay(taskIntervals.comment * 1000));
      }
    }

    // Unfollow (from followers list of own account)
    if (config.unfollowEnabled && stats.unfollows < config.maxUnfollow) {
      try {
        const followers = await ig.getFollowers(client, account.username, 5);
        // This is simplified — in production you'd track who was followed and unfollow after N days
        for (const follower of followers.slice(0, 2)) {
          if (!isAccountRunning(accountId)) break;
          if (stats.unfollows >= config.maxUnfollow) break;

          const result = await ig.unfollowUser(client, follower);
          await logActivity(accountId, "unfollow", result);
          await updateAnalytics(accountId, "unfollow", result.success);
          if (result.success) stats.unfollows++;
          else stats.errors++;

          await delay(randomDelay(taskIntervals.unfollow * 1000));
        }
      } catch (e) {
        console.error("Unfollow error:", e);
        stats.errors++;
      }
    }

    // Rest period between cycles
    await delay(randomDelay(config.detectionDelay * 1000));
  }

  // Cleanup
  runningAccounts.set(accountId, { running: false, stats });
  ig.clearSession(account.username);

  // Update account info before stopping
  try {
    const info = await ig.getAccountInfo(client!, account.username);
    await prisma.instaAccount.update({
      where: { id: accountId },
      data: {
        status: "idle",
        followers: info.followers,
        following: info.following,
        posts: info.posts,
        lastActivity: new Date(),
      },
    });
  } catch {
    await prisma.instaAccount.update({
      where: { id: accountId },
      data: { status: "idle", lastActivity: new Date() },
    });
  }
}
