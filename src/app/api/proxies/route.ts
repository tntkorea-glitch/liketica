import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";
import { encrypt } from "@/lib/crypto";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const proxies = await prisma.proxy.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      protocol: true,
      host: true,
      port: true,
      username: true,
      active: true,
      createdAt: true,
      accounts: { select: { id: true, username: true } },
    },
  });

  return Response.json(proxies);
}

const proxySchema = z.object({
  label: z.string().min(1, "이름을 입력하세요"),
  protocol: z.enum(["http", "https", "socks5"]).default("http"),
  host: z.string().min(1, "호스트를 입력하세요"),
  port: z.coerce.number().int().min(1).max(65535),
  username: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = proxySchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.message);

  const proxy = await prisma.proxy.create({
    data: {
      userId: user.id,
      label: parsed.data.label,
      protocol: parsed.data.protocol,
      host: parsed.data.host,
      port: parsed.data.port,
      username: parsed.data.username || null,
      password: parsed.data.password || null,
      active: parsed.data.active ?? true,
    },
  });

  return Response.json(proxy, { status: 201 });
}

const updateSchema = proxySchema.partial().extend({ id: z.string().min(1) });

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.message);

  const { id, ...rest } = parsed.data;
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) data[k] = v;
  }

  await prisma.proxy.updateMany({
    where: { id, userId: user.id },
    data,
  });

  return Response.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return badRequest("id가 필요합니다");

  await prisma.proxy.deleteMany({
    where: { id, userId: user.id },
  });

  return Response.json({ success: true });
}
