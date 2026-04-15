import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";
import { completeTwoFactorLogin } from "@/lib/instagram";

const schema = z.object({
  accountId: z.string().min(1),
  code: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.message);

  const account = await prisma.instaAccount.findFirst({
    where: { id: parsed.data.accountId, userId: user.id },
  });
  if (!account) return badRequest("계정을 찾을 수 없습니다");

  try {
    await completeTwoFactorLogin(account.username, parsed.data.code);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "2FA 검증 실패";
    await prisma.instaAccount.update({
      where: { id: account.id },
      data: { status: "error" },
    });
    return badRequest(msg);
  }

  await prisma.instaAccount.update({
    where: { id: account.id },
    data: {
      status: "idle",
      twoFactorEnabled: true,
      twoFactorIdentifier: null,
    },
  });

  return Response.json({ success: true });
}
