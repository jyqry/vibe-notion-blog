"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import BlogPostClient from "@/components/BlogPostClient";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { setIsLoading } = useLoading();

  // 페이지 로드 시 로딩 상태 해제 (스켈레톤 UI 표시를 위해)
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return <BlogPostClient slug={slug} />;
}
