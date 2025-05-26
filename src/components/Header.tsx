"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { siteConfig } from "@/config/site";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading, setLoadingMessage } = useLoading();

  const handleNavigation = (href: string, name: string) => {
    if (pathname !== href) {
      // 데이터 페칭이 필요한 페이지들만 로딩 상태 설정
      const needsLoading =
        href === "/" || href === "/blog" || href.startsWith("/blog/");

      if (needsLoading) {
        setLoadingMessage(`${name} 페이지로 이동 중...`);
        setIsLoading(true);
      }

      router.push(href);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <button
            onClick={() => handleNavigation("/", "홈")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            {siteConfig.logo.image ? (
              <img
                src={siteConfig.logo.image}
                alt={siteConfig.name}
                className="h-8 w-8"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {siteConfig.logo.text.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-bold text-xl">{siteConfig.logo.text}</span>
          </button>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            {siteConfig.navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href, item.name)}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden p-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
