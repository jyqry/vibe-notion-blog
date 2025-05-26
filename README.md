# Vibe Notion Blog

Notion을 기반으로 한 개인 블로그 웹사이트입니다. Next.js 15와 TypeScript로 구축되었으며, Notion API를 통해 콘텐츠를 관리합니다.

## 주요 기능

- 🚀 **Next.js 15** (App Router) 기반
- 📝 **Notion API** 연동으로 콘텐츠 관리
- ⚡ **실시간 캐싱** 시스템 (SWR)
- 🎨 **Tailwind CSS**로 반응형 디자인
- 📱 **모바일 최적화**
- 🔍 **SEO 최적화**
- 📊 **마크다운 렌더링** (코드 하이라이팅 포함)
- 🔄 **백그라운드 데이터 동기화**
- 📤 **소셜 미디어 공유**

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, React
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Content**: Notion API, notion-to-md
- **Markdown**: react-markdown, remark-gfm, rehype-highlight
- **Deployment**: Vercel

## 설치 및 설정

### 1. 프로젝트 클론

\`\`\`bash
git clone <repository-url>
cd vibe-notion-blog
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. Notion 설정

#### 3.1 Notion Integration 생성

1. [Notion Developers](https://www.notion.so/my-integrations)에 접속
2. "New integration" 클릭
3. 이름을 입력하고 워크스페이스 선택
4. "Submit" 클릭하여 Integration 생성
5. **Internal Integration Token** 복사 (나중에 사용)

#### 3.2 Notion 데이터베이스 생성

블로그 포스트를 위한 Notion 데이터베이스를 다음 속성으로 생성하세요:

| 속성명        | 타입         | 설명                    |
| ------------- | ------------ | ----------------------- |
| **Title**     | Title        | 포스트 제목 (필수)      |
| **Slug**      | Rich Text    | URL 슬러그 (필수)       |
| **Published** | Checkbox     | 게시 여부 (필수)        |
| **Created**   | Date         | 생성일                  |
| **Updated**   | Date         | 수정일                  |
| **Excerpt**   | Rich Text    | 요약 (선택)             |
| **Tags**      | Multi-select | 태그 (선택)             |
| **Author**    | Rich Text    | 작성자 (선택)           |
| **Category**  | Select       | 카테고리 (선택)         |
| **Featured**  | Checkbox     | 추천 포스트 여부 (선택) |

#### 3.3 데이터베이스 권한 설정

1. 생성한 데이터베이스 페이지에서 "Share" 클릭
2. "Invite" 섹션에서 생성한 Integration 선택
3. "Invite" 클릭

#### 3.4 데이터베이스 ID 복사

데이터베이스 URL에서 ID를 복사하세요:
\`\`\`
https://www.notion.so/your-workspace/DATABASE_ID?v=...
\`\`\`

### 4. 환경 변수 설정

프로젝트 루트에 \`.env.local\` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`env

# Notion API 설정

NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

# 사이트 설정

NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 5. 사이트 설정 커스터마이징

\`src/config/site.ts\` 파일을 수정하여 사이트 정보를 변경하세요:

\`\`\`typescript
export const siteConfig = {
name: "Your Blog Name",
description: "Your blog description",
author: {
name: "Your Name",
email: "your.email@example.com",
twitter: "@yourusername",
},
links: {
twitter: "https://twitter.com/yourusername",
github: "https://github.com/yourusername",
},
// ... 기타 설정
}
\`\`\`

### 6. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정:
   - \`NOTION_TOKEN\`
   - \`NOTION_DATABASE_ID\`
   - \`NEXT_PUBLIC_SITE_URL\` (배포된 도메인)
3. 배포 완료

## 사용법

### 블로그 포스트 작성

1. Notion 데이터베이스에 새 페이지 생성
2. 필수 속성 입력:
   - **Title**: 포스트 제목
   - **Slug**: URL에 사용될 슬러그 (예: "my-first-post")
   - **Published**: 체크하여 게시
3. 페이지 내용을 마크다운으로 작성
4. 저장하면 자동으로 블로그에 반영

### 캐싱 시스템

- 페이지 접속 시 캐시된 데이터를 먼저 표시
- 백그라운드에서 Notion 데이터 변경 확인
- 변경사항이 있으면 자동으로 캐시 업데이트
- 새로고침 없이 최신 내용 반영

## 프로젝트 구조

\`\`\`
src/
├── app/ # Next.js App Router 페이지
│ ├── api/ # API 라우트
│ ├── blog/ # 블로그 페이지
│ └── about/ # 소개 페이지
├── components/ # React 컴포넌트
├── config/ # 사이트 설정
├── lib/ # 유틸리티 함수
└── types/ # TypeScript 타입 정의
\`\`\`

## 커스터마이징

### 스타일링

- \`src/app/globals.css\`: 글로벌 스타일
- \`tailwind.config.js\`: Tailwind 설정
- 컴포넌트별 스타일은 Tailwind 클래스 사용

### 기능 추가

- \`src/config/site.ts\`: 사이트 설정 수정
- \`src/components/\`: 새 컴포넌트 추가
- \`src/lib/\`: 유틸리티 함수 추가

## 문제 해결

### 일반적인 문제

1. **Notion API 오류**: Integration 토큰과 데이터베이스 권한 확인
2. **빌드 오류**: 환경 변수 설정 확인
3. **스타일 문제**: Tailwind CSS 설정 확인

### 디버깅

개발자 도구의 콘솔에서 오류 메시지를 확인하세요.

## 라이선스

MIT License

## 기여

이슈나 풀 리퀘스트를 통해 기여해주세요!
