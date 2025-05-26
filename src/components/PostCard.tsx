import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/notion";
import { siteConfig } from "@/config/site";

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="group relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/blog/${post.slug}`}>
        {/* 커버 이미지 */}
        {post.coverImage && (
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        <div className="p-6">
          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 제목 */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          {/* 요약 */}
          {post.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              {siteConfig.blog.showReadingTime && post.readingTime && (
                <span>{post.readingTime}분 읽기</span>
              )}
            </div>
            {post.author && <span className="font-medium">{post.author}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
