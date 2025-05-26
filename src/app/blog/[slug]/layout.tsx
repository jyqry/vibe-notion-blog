import { notionServerService } from "@/lib/notion-server";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await notionServerService.getPostBySlug(slug);

    if (!post) {
      return {
        title: "포스트를 찾을 수 없습니다",
        description: "요청하신 포스트가 존재하지 않습니다.",
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "포스트를 찾을 수 없습니다",
      description: "요청하신 포스트가 존재하지 않습니다.",
    };
  }
}

export default async function BlogPostLayout({
  children,
  params,
}: BlogPostLayoutProps) {
  try {
    const { slug } = await params;
    const post = await notionServerService.getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Error in blog post layout:", error);
    notFound();
  }
}
