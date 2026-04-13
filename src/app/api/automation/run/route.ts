import { getAuthUser, unauthorized, badRequest } from "@/lib/api-utils";
import { runAutomation, stopAccount } from "@/lib/automation-engine";
import { NextRequest } from "next/server";

// POST /api/automation/run — start or stop automation
export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const { accountId, action } = body;

  if (!accountId) return badRequest("accountId가 필요합니다");

  if (action === "stop") {
    stopAccount(accountId);
    return Response.json({ success: true, message: "중지 요청됨" });
  }

  const result = await runAutomation(user.id, accountId);
  if ("error" in result) {
    return badRequest(result.error ?? "알 수 없는 오류");
  }

  return Response.json(result);
}
