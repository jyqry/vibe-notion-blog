import { NextResponse } from "next/server";
import { notionServerService } from "@/lib/notion-server";
import { cacheManager } from "@/lib/cache-manager";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // NotionService에서 캐시 우선 로딩 처리
    const post = await notionServerService.getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const cacheStatus = cacheManager.getCacheStatus();

    return NextResponse.json({
      ...post,
      cached: cacheStatus.hasCachedPosts,
      cacheInfo: {
        lastUpdated: cacheStatus.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Error in /api/posts/[slug]:", error);

    // 오류 발생 시 캐시된 데이터라도 반환
    const cachedPost = cacheManager.getCachedPost(params.slug);
    if (cachedPost) {
      return NextResponse.json({
        ...cachedPost,
        cached: true,
        error: "Failed to fetch fresh data, returning cached data",
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
