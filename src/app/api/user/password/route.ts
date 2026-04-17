import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";

const schema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다").max(128),
});

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.message);

  const { currentPassword, newPassword } = parsed.data;

  if (user.hashedPassword) {
    if (!currentPassword) return badRequest("현재 비밀번호를 입력하세요");
    const ok = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!ok) return badRequest("현재 비밀번호가 일치하지 않습니다");
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword: hashed },
  });

  return Response.json({ success: true });
}
