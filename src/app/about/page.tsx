"use client";

import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  const { setIsLoading } = useLoading();

  // 페이지 로드 시 로딩 상태 해제
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">소개</h1>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {siteConfig.name}에 오신 것을 환영합니다
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">기술 스택</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Next.js 15 (App Router)</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Notion API</li>
              <li>• SWR (데이터 페칭)</li>
              <li>• React Markdown</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">주요 기능</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Notion 데이터베이스 연동</li>
              <li>• 실시간 캐싱 시스템</li>
              <li>• 마크다운 렌더링</li>
              <li>• 반응형 디자인</li>
              <li>• SEO 최적화</li>
              <li>• 소셜 미디어 공유</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">연락처</h3>
          <div className="space-y-2 text-gray-700">
            <p>이메일: {siteConfig.author.email}</p>
            {siteConfig.links.twitter && (
              <p>
                Twitter:
                <a
                  href={siteConfig.links.twitter}
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteConfig.author.twitter}
                </a>
              </p>
            )}
            {siteConfig.links.github && (
              <p>
                GitHub:
                <a
                  href={siteConfig.links.github}
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteConfig.links.github}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
