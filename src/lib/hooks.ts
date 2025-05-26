import useSWR from "swr";
import { BlogPost } from "@/types/notion";
import { notionService } from "./notion";
import { cacheManager } from "./cache";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function usePosts() {
  const { data, error, mutate } = useSWR<BlogPost[]>("/api/posts", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 5, // 5분마다 재검증
  });

  return {
    posts: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function usePost(slug: string) {
  const { data, error, mutate } = useSWR<BlogPost>(
    slug ? `/api/posts/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 1000 * 60 * 5, // 5분마다 재검증
    }
  );

  return {
    post: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// 백그라운드에서 데이터 업데이트 확인
export async function checkForUpdates(slug?: string) {
  try {
    if (slug) {
      // 특정 포스트 업데이트 확인
      const cachedPost = cacheManager.get(`post-${slug}`);
      if (cachedPost) {
        const lastModified = await notionService.getPageLastModified(
          cachedPost.id
        );
        if (cacheManager.isStale(`post-${slug}`, lastModified)) {
          // 캐시 무효화 및 새 데이터 페치
          cacheManager.invalidate(`post-${slug}`);
          const updatedPost = await notionService.getPostBySlug(slug);
          if (updatedPost) {
            cacheManager.set(`post-${slug}`, updatedPost);
            return updatedPost;
          }
        }
      }
    } else {
      // 모든 포스트 업데이트 확인
      const posts = await notionService.getAllPosts();
      posts.forEach((post) => {
        cacheManager.set(`post-${post.slug}`, post);
      });
      return posts;
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
  return null;
}
