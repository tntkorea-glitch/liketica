import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextRequest } from "next/server";

const registerSchema = z.object({
  name: z.string().min(2, "이름은 2글자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json(
        { error: "이미 등록된 이메일입니다" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        automationConfig: {
          create: {},
        },
        scheduleConfig: {
          create: {
            schedule: JSON.stringify({
              mon: Array(24).fill(0),
              tue: Array(24).fill(0),
              wed: Array(24).fill(0),
              thu: Array(24).fill(0),
              fri: Array(24).fill(0),
              sat: Array(24).fill(0),
              sun: Array(24).fill(0),
            }),
          },
        },
      },
    });

    return Response.json(
      { message: "회원가입 성공", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
