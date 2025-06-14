import useSWR from "swr";
import { BlogPost } from "@/types/notion";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect } from "react";

interface PostsResponse {
  posts: BlogPost[];
  total: number;
  cached: boolean;
  cacheInfo?: {
    lastUpdated: string | null;
    postsCount: number;
  };
  error?: string;
}

interface PostResponse extends BlogPost {
  cached: boolean;
  cacheInfo?: {
    lastUpdated: string | null;
  };
  error?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function usePosts() {
  const { setIsLoading, setLoadingMessage } = useLoading();
  const { data, error, mutate } = useSWR<PostsResponse>("/api/posts", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 5, // 5분마다 재검증
  });

  const isLoading = !error && !data;

  useEffect(() => {
    if (isLoading) {
      setLoadingMessage("포스트 목록을 불러오는 중...");
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, setLoadingMessage]);

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    cached: data?.cached || false,
    cacheInfo: data?.cacheInfo,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePost(slug: string) {
  const { setIsLoading, setLoadingMessage } = useLoading();
  const { data, error, mutate } = useSWR<PostResponse>(
    slug ? `/api/posts/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 1000 * 60 * 5, // 5분마다 재검증
    }
  );

  const isLoading = !error && !data && !!slug;

  useEffect(() => {
    if (isLoading) {
      setLoadingMessage("포스트를 불러오는 중...");
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, setLoadingMessage]);

  return {
    post: data,
    cached: data?.cached || false,
    cacheInfo: data?.cacheInfo,
    isLoading,
    isError: error,
    mutate,
  };
}

// 캐시 관리 API 호출 함수들
export async function refreshCache() {
  try {
    const response = await fetch("/api/cache", {
      method: "POST",
    });
    return await response.json();
  } catch (error) {
    console.error("캐시 새로고침 오류:", error);
    throw error;
  }
}

export async function clearCache() {
  try {
    const response = await fetch("/api/cache", {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("캐시 삭제 오류:", error);
    throw error;
  }
}

export async function getCacheStatus() {
  try {
    const response = await fetch("/api/cache");
    return await response.json();
  } catch (error) {
    console.error("캐시 상태 확인 오류:", error);
    throw error;
  }
}

// 환경 변수 상태 확인
export function useEnvStatus() {
  const { data, error, mutate } = useSWR("/api/env-status", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0, // 수동으로만 새로고침
  });

  return {
    envStatus: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export async function getEnvStatus() {
  try {
    const response = await fetch("/api/env-status");
    return await response.json();
  } catch (error) {
    console.error("환경 변수 상태 확인 오류:", error);
    throw error;
  }
}
