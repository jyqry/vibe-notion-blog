import { NextResponse } from "next/server";
import { cacheManager } from "@/lib/cache-manager";
import { notionServerService } from "@/lib/notion-server";

// 캐시 상태 확인
export async function GET() {
  try {
    const cacheStatus = cacheManager.getCacheStatus();
    const cachedMetadata = cacheManager.getCachedMetadata();

    return NextResponse.json({
      status: "success",
      cache: {
        ...cacheStatus,
        metadata: cachedMetadata,
      },
    });
  } catch (error) {
    console.error("Cache status check error:", error);
    return NextResponse.json(
      { error: "Failed to check cache status" },
      { status: 500 }
    );
  }
}

// 캐시 강제 새로고침
export async function POST() {
  try {
    console.log("캐시 강제 새로고침 시작...");

    // 캐시 무효화
    cacheManager.invalidateCache();

    // 새로운 데이터 가져오기
    const posts = await notionServerService.getAllPosts();

    return NextResponse.json({
      status: "success",
      message: "Cache refreshed successfully",
      postsCount: posts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cache refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh cache" },
      { status: 500 }
    );
  }
}

// 캐시 삭제
export async function DELETE() {
  try {
    cacheManager.invalidateCache();

    return NextResponse.json({
      status: "success",
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cache clear error:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}
