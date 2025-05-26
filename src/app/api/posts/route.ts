import { NextResponse } from "next/server";
import { notionServerService } from "@/lib/notion-server";
import { cacheManager } from "@/lib/cache-manager";

export async function GET() {
  try {
    const posts = await notionServerService.getAllPosts();
    const cacheStatus = cacheManager.getCacheStatus();

    return NextResponse.json({
      posts,
      total: posts.length,
      cached: cacheStatus.hasCachedPosts,
      cacheInfo: {
        lastUpdated: cacheStatus.lastUpdated,
        postsCount: cacheStatus.postsCount,
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    // 오류 발생 시 캐시된 데이터라도 반환
    const cachedPosts = cacheManager.getCachedPosts() || [];
    return NextResponse.json({
      posts: cachedPosts,
      total: cachedPosts.length,
      cached: true,
      error: "Failed to fetch fresh data, returning cached data",
    });
  }
}
