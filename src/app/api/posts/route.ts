import { NextResponse } from "next/server";
import { notionServerService } from "@/lib/notion-server";
import { cacheManager } from "@/lib/cache-manager";

// Vercel 환경에서 5분간 캐시
export const revalidate = 300;

export async function GET() {
  try {
    const posts = await notionServerService.getAllPosts();
    const cacheStatus = cacheManager.getCacheStatus();
    const isVercel =
      process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      posts,
      total: posts.length,
      cached: isVercel ? false : cacheStatus.hasCachedPosts,
      environment: cacheStatus.environment || (isVercel ? "vercel" : "local"),
      cacheInfo: {
        lastUpdated: cacheStatus.lastUpdated || new Date().toISOString(),
        postsCount: posts.length,
      },
    });

    // Vercel 환경에서 추가 캐시 헤더 설정
    if (isVercel) {
      response.headers.set(
        "Cache-Control",
        "s-maxage=300, stale-while-revalidate=600"
      );
    }

    return response;
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        posts: [],
        total: 0,
        cached: false,
        error: "Failed to fetch posts",
        environment: process.env.VERCEL === "1" ? "vercel" : "local",
      },
      { status: 500 }
    );
  }
}
