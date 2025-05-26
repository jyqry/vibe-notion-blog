import { NextResponse } from "next/server";
import { notionService } from "@/lib/notion";
import { cacheManager } from "@/lib/cache";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // 캐시에서 먼저 확인
    const cacheKey = `post-${slug}`;
    const cachedPost = cacheManager.get(cacheKey);

    if (cachedPost) {
      // 백그라운드에서 업데이트 확인
      checkForUpdatesInBackground(slug);
      return NextResponse.json(cachedPost);
    }

    // 캐시에 없으면 Notion에서 가져오기
    const post = await notionService.getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 캐시에 저장
    cacheManager.set(cacheKey, post);

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error in /api/posts/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

async function checkForUpdatesInBackground(slug: string) {
  try {
    const cacheKey = `post-${slug}`;
    const cachedPost = cacheManager.get(cacheKey);

    if (cachedPost) {
      const lastModified = await notionService.getPageLastModified(
        cachedPost.id
      );

      if (cacheManager.isStale(cacheKey, lastModified)) {
        const updatedPost = await notionService.getPostBySlug(slug);
        if (updatedPost) {
          cacheManager.set(cacheKey, updatedPost);
        }
      }
    }
  } catch (error) {
    console.error("Background update failed:", error);
  }
}
