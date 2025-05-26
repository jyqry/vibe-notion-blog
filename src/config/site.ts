export const siteConfig = {
  name: "Vibe Notion Blog",
  description: "Notion을 기반으로 한 개인 블로그",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername",
  },
  author: {
    name: "Your Name",
    email: "your.email@example.com",
    twitter: "@yourusername",
  },
  logo: {
    text: "Vibe Blog",
    image: "/logo.png", // 로고 이미지 경로 (선택사항)
  },
  navigation: [
    {
      name: "홈",
      href: "/",
    },
    {
      name: "블로그",
      href: "/blog",
    },
    {
      name: "소개",
      href: "/about",
    },
  ],
  // 블로그 설정
  blog: {
    postsPerPage: 10,
    showExcerpt: true,
    showReadingTime: true,
    showTags: true,
  },
  // 소셜 미디어 공유 설정
  social: {
    enableSharing: true,
    platforms: ["twitter", "facebook", "linkedin"],
  },
};
