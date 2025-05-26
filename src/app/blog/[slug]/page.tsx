import { notionServerService } from "@/lib/notion-server";
import BlogPostClient from "@/components/BlogPostClient";
import { siteConfig } from "@/config/site";
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

  // SEO를 위해 서버에서 포스트 존재 여부만 확인
  const post = await notionServerService.getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  // 실제 렌더링은 클라이언트 컴포넌트에서 처리
  return <BlogPostClient slug={slug} />;
}
