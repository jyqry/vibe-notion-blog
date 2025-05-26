"use client";

import { usePosts } from "@/lib/hooks";
import PostCard from "@/components/PostCard";
import { siteConfig } from "@/config/site";

export default function BlogPage() {
  const { posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            오류가 발생했습니다
          </h1>
          <p className="text-gray-600">
            블로그 포스트를 불러오는 중 문제가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">블로그</h1>
        <p className="text-xl text-gray-600">
          개발과 기술에 대한 이야기를 공유합니다
        </p>
      </div>

      {/* 포스트 목록 */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">아직 게시된 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
