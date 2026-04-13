import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/api-utils";
import { NextRequest } from "next/server";

// GET /api/automation - 자동화 설정 조회
export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  let config = await prisma.automationConfig.findUnique({
    where: { userId: user.id },
  });

  if (!config) {
    config = await prisma.automationConfig.create({
      data: { userId: user.id },
    });
  }

  return Response.json(config);
}

// PUT /api/automation - 자동화 설정 업데이트
export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();

  // userId, id, createdAt, updatedAt 제거
  const { id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua, ...data } = body;

  const config = await prisma.automationConfig.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });

  return Response.json(config);
}
