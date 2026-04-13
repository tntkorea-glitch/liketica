import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";
import { NextRequest } from "next/server";
import { z } from "zod";

// GET /api/accounts - 계정 목록 조회
export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const accounts = await prisma.instaAccount.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(accounts);
}

const addAccountSchema = z.object({
  username: z.string().min(1, "사용자명을 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
  proxy: z.string().optional(),
});

// POST /api/accounts - 계정 추가
export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = addAccountSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0].message);

  const { username, password, proxy } = parsed.data;

  // 중복 체크
  const existing = await prisma.instaAccount.findFirst({
    where: { userId: user.id, username },
  });
  if (existing) return badRequest("이미 등록된 계정입니다");

  const account = await prisma.instaAccount.create({
    data: {
      userId: user.id,
      username,
      password, // TODO: encrypt in production
      proxy: proxy || null,
    },
  });

  return Response.json(account, { status: 201 });
}

// DELETE /api/accounts?id=xxx - 계정 삭제
export async function DELETE(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return badRequest("계정 ID가 필요합니다");

  await prisma.instaAccount.deleteMany({
    where: { id, userId: user.id },
  });

  return Response.json({ success: true });
}

// PATCH /api/accounts - 계정 상태 토글
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const { id, active } = body;

  const account = await prisma.instaAccount.updateMany({
    where: { id, userId: user.id },
    data: { active },
  });

  return Response.json(account);
}
