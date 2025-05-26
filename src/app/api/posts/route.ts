import { NextResponse } from "next/server";
import { notionService } from "@/lib/notion";
import { cacheManager } from "@/lib/cache";

export async function GET() {
  try {
    // 캐시에서 먼저 확인
    const cachedPosts = cacheManager.get("all-posts");
    if (cachedPosts) {
      // 백그라운드에서 업데이트 확인
      checkForUpdatesInBackground();
      return NextResponse.json(cachedPosts);
    }

    // 캐시에 없으면 Notion에서 가져오기
    const posts = await notionService.getAllPosts();

    // 캐시에 저장
    cacheManager.set("all-posts", posts as any);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in /api/posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

async function checkForUpdatesInBackground() {
  try {
    const posts = await notionService.getAllPosts();
    cacheManager.set("all-posts", posts as any);
  } catch (error) {
    console.error("Background update failed:", error);
  }
}
