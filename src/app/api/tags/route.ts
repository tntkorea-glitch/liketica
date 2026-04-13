import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";
import { NextRequest } from "next/server";
import { z } from "zod";

// GET /api/tags - 태그 그룹 목록
export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const groups = await prisma.tagGroup.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(
    groups.map((g) => ({
      ...g,
      tags: JSON.parse(g.tags),
    }))
  );
}

const tagGroupSchema = z.object({
  name: z.string().min(1),
  tags: z.array(z.string()),
  followEnabled: z.boolean().optional(),
  likeEnabled: z.boolean().optional(),
  commentEnabled: z.boolean().optional(),
});

// POST /api/tags - 태그 그룹 생성
export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = tagGroupSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.message);

  const group = await prisma.tagGroup.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      tags: JSON.stringify(parsed.data.tags),
      followEnabled: parsed.data.followEnabled ?? true,
      likeEnabled: parsed.data.likeEnabled ?? true,
      commentEnabled: parsed.data.commentEnabled ?? false,
    },
  });

  return Response.json({ ...group, tags: JSON.parse(group.tags) }, { status: 201 });
}

// DELETE /api/tags?id=xxx
export async function DELETE(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return badRequest("태그 그룹 ID가 필요합니다");

  await prisma.tagGroup.deleteMany({ where: { id, userId: user.id } });
  return Response.json({ success: true });
}

// PUT /api/tags - 태그 그룹 수정
export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return badRequest("태그 그룹 ID가 필요합니다");

  if (data.tags && Array.isArray(data.tags)) {
    data.tags = JSON.stringify(data.tags);
  }

  const group = await prisma.tagGroup.updateMany({
    where: { id, userId: user.id },
    data,
  });

  return Response.json(group);
}
