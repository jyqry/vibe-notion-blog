"use client";

import { usePosts } from "@/lib/hooks";
import PostCard from "@/components/PostCard";
import PostCardSkeleton from "@/components/PostCardSkeleton";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const { posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* 히어로 섹션 */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {siteConfig.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {siteConfig.description}
          </p>
        </section>

        {/* 최신 포스트 스켈레톤 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">최신 포스트</h2>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        </section>
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
      {/* 히어로 섹션 */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {siteConfig.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
      </section>

      {/* 최신 포스트 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">최신 포스트</h2>
          <a
            href="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            모든 포스트 보기 →
          </a>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">아직 게시된 포스트가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
