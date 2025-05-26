import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env-server";

export async function GET() {
  try {
    const status = serverEnv.getStatus();

    return NextResponse.json({
      status: "success",
      environment: {
        nodeEnv: status.nodeEnv,
        isConfigured: status.isConfigured,
        hasNotionToken: status.hasNotionToken,
        hasNotionDatabaseId: status.hasNotionDatabaseId,
      },
      message: status.isConfigured
        ? "모든 환경 변수가 올바르게 설정되었습니다."
        : "일부 환경 변수가 누락되었습니다. .env.local 파일을 확인하세요.",
    });
  } catch (error) {
    console.error("Environment status check error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "환경 변수 상태 확인 중 오류가 발생했습니다.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
