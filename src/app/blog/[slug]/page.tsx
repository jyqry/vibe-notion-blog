import { notionServerService } from "@/lib/notion-server";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import SocialShare from "@/components/SocialShare";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await notionServerService.getPostBySlug(slug);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다",
    };
  }

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt || siteConfig.description,
    openGraph: {
      title: post.title,
      description: post.excerpt || siteConfig.description,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || siteConfig.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await notionServerService.getPostBySlug(slug);

  if (!post) {
    notFound();
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
            <SocialShare title={post.title} />
          )}
        </div>
      </footer>
    </article>
  );
}
