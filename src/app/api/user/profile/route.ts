import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    plan: user.plan,
    hasPassword: !!user.hashedPassword,
    createdAt: user.createdAt,
  });
}

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력하세요").max(60),
});

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.message);

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });

  return Response.json({ success: true, name: parsed.data.name });
}
