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

| 속성명        | 타입         | 필수 여부 | 설명                             |
| ------------- | ------------ | --------- | -------------------------------- |
| **Title**     | Title        | ✅ 필수   | 포스트 제목                      |
| **Slug**      | Rich Text    | ✅ 필수   | URL 슬러그 (예: "my-first-post") |
| **Published** | Checkbox     | ✅ 필수   | 게시 여부 (체크하면 공개)        |
| **Created**   | Date         | 🔶 권장   | 생성일 (자동 설정 가능)          |
| **Updated**   | Date         | 🔶 권장   | 수정일 (자동 설정 가능)          |
| **Excerpt**   | Rich Text    | ⚪ 선택   | 포스트 요약 (미리보기용)         |
| **Tags**      | Multi-select | ⚪ 선택   | 태그 (카테고리 분류용)           |
| **Author**    | Rich Text    | ⚪ 선택   | 작성자명                         |
| **Category**  | Select       | ⚪ 선택   | 카테고리 (단일 선택)             |
| **Featured**  | Checkbox     | ⚪ 선택   | 추천 포스트 여부                 |

**💡 데이터베이스 생성 팁:**

- Notion에서 "Table" 템플릿으로 새 페이지 생성
- 위 속성들을 하나씩 추가 (속성명과 타입을 정확히 맞춰주세요)
- 테스트용 포스트를 하나 만들어서 확인해보세요

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

# ===========================================

# Vibe Notion Blog - 환경 변수 설정

# ===========================================

# ===========================================

# Notion API 설정 (필수)

# ===========================================

# Notion Integration Token

# 1. https://www.notion.so/my-integrations 에서 새 Integration 생성

# 2. "Internal Integration Token" 복사하여 아래에 붙여넣기

NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Notion Database ID

# 1. 블로그용 Notion 데이터베이스 생성

# 2. 데이터베이스 URL에서 ID 부분 복사

# 예시: https://www.notion.so/workspace/DATABASE_ID?v=...

NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================

# 사이트 설정

# ===========================================

# 사이트 URL (개발 환경)

NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 사이트 URL (프로덕션 환경 - Vercel 배포 시)

# NEXT_PUBLIC_SITE_URL=https://your-blog-domain.vercel.app

# ===========================================

# 선택적 설정 (필요시 추가)

# ===========================================

# Google Analytics ID (선택사항)

# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics (선택사항)

# NEXT_PUBLIC_VERCEL_ANALYTICS=true

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

## 환경 변수 설정 가이드

### .env.local 파일 생성 방법

1. **프로젝트 루트 디렉토리**에 `.env.local` 파일을 생성하세요
2. 위의 환경 변수 예시를 복사하여 붙여넣기
3. `your_notion_integration_token_here`와 `your_notion_database_id_here`를 실제 값으로 변경

### 환경 변수 값 찾는 방법

#### NOTION_TOKEN 찾기:

1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. 생성한 Integration 클릭
3. "Internal Integration Token" 복사
4. `secret_`로 시작하는 긴 문자열입니다

#### NOTION_DATABASE_ID 찾기:

1. Notion에서 생성한 데이터베이스 페이지 열기
2. 브라우저 주소창의 URL 확인
3. URL 형태: `https://www.notion.so/workspace/DATABASE_ID?v=...`
4. `DATABASE_ID` 부분을 복사 (32자리 문자열)

### 환경 변수 확인 방법

터미널에서 다음 명령어로 환경 변수가 제대로 로드되는지 확인:

\`\`\`bash
npm run dev
\`\`\`

콘솔에 "NOTION_DATABASE_ID is not set" 경고가 나타나지 않으면 성공!

## 문제 해결

### 일반적인 문제

1. **Notion API 오류**: Integration 토큰과 데이터베이스 권한 확인
2. **빌드 오류**: 환경 변수 설정 확인
3. **스타일 문제**: Tailwind CSS 설정 확인
4. **환경 변수 인식 안됨**: `.env.local` 파일 위치와 이름 확인
5. **데이터베이스 연결 실패**: Database ID와 Integration 권한 확인

### 디버깅

개발자 도구의 콘솔에서 오류 메시지를 확인하세요.

## 라이선스

MIT License

## 기여

이슈나 풀 리퀘스트를 통해 기여해주세요!
