"use client";

import { usePost } from "@/lib/hooks";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { siteConfig } from "@/config/site";
import Image from "next/image";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { post, isLoading, isError } = usePost(params.slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            포스트를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600">
            요청하신 포스트가 존재하지 않거나 삭제되었습니다.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 커버 이미지 */}
      {post.coverImage && (
        <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 포스트 헤더 */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          {siteConfig.blog.showReadingTime && post.readingTime && (
            <span>{post.readingTime}분 읽기</span>
          )}
          {post.author && <span>by {post.author}</span>}
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 요약 */}
        {post.excerpt && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        )}
      </header>

      {/* 포스트 내용 */}
      <div className="prose prose-lg max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* 포스트 푸터 */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            마지막 업데이트: {formatDate(post.updatedAt)}
          </div>

          {siteConfig.social.enableSharing && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">공유하기:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Facebook
              </a>
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}
