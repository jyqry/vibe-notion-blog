import { NextResponse } from "next/server";
import { notionServerService } from "@/lib/notion-server";
import { cacheManager } from "@/lib/cache-manager";

// Vercel 환경에서 5분간 캐시
export const revalidate = 300;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isVercel =
      process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    // NotionServerService에서 포스트 가져오기
    const post = await notionServerService.getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const cacheStatus = cacheManager.getCacheStatus();

    const response = NextResponse.json({
      ...post,
      cached: isVercel ? false : cacheStatus.hasCachedPosts,
      environment: cacheStatus.environment || (isVercel ? "vercel" : "local"),
      cacheInfo: {
        lastUpdated: cacheStatus.lastUpdated || new Date().toISOString(),
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
    console.error("Error in /api/posts/[slug]:", error);

    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
