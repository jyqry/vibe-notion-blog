# Vibe Notion Blog

> 🤖 **AI 코딩으로 제작**: 이 프로젝트는 바이브코딩(AI 페어 프로그래밍)으로 작성되었습니다. 상세한 프롬프트와 개발 과정은 [커밋 메시지](../../commits)에서 확인할 수 있습니다.

Notion을 기반으로 한 개인 블로그 웹사이트입니다. Next.js 15와 TypeScript로 구축되었으며, Notion API를 통해 콘텐츠를 관리합니다.

## 주요 기능

- 🚀 **Next.js 15** (App Router) 기반
- 📝 **Notion API** 연동으로 콘텐츠 관리
- ⚡ **영구적 파일 시스템 캐싱** (즉시 응답, 백그라운드 업데이트)
- 🔒 **보안 강화** (서버 전용 API 토큰 관리)
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

```bash
git clone <repository-url>
cd vibe-notion-blog
```

### 2. 의존성 설치

```bash
npm install
```

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

#### 📋 Published 속성 상세 설명

**Published** 속성은 포스트의 공개 여부를 제어하는 중요한 속성입니다:

| Published 값     | 공개 상태  | 설명                        |
| ---------------- | ---------- | --------------------------- |
| ✅ **체크됨**    | **공개**   | 블로그에서 볼 수 있음       |
| ⬜ **체크 안됨** | **비공개** | 블로그에서 숨겨짐           |
| ❌ **속성 없음** | **오류**   | Published 속성이 필수입니다 |

**🔧 Published 속성 동작 방식:**

- **체크된 포스트만** 블로그에 표시됩니다
- **체크되지 않은 포스트**는 완전히 숨겨집니다
- **Published 속성이 없으면** 데이터베이스 오류가 발생합니다
- **초안 작성**: Published를 체크하지 않고 작성하면 초안으로 저장
- **즉시 공개**: Published를 체크하면 바로 블로그에 반영

**📝 권장 워크플로우:**

1. 새 포스트 작성 시 Published는 체크하지 않음 (초안 상태)
2. 내용 작성 완료 후 Published 체크 (공개)
3. 임시로 숨기고 싶을 때 Published 체크 해제 (비공개)

#### 3.3 데이터베이스 권한 설정 (중요!)

Integration이 데이터베이스에 접근할 수 있도록 권한을 부여해야 합니다:

**단계 1: 데이터베이스 페이지에서 메뉴 열기**

1. 생성한 블로그 데이터베이스 페이지를 엽니다
2. 페이지 우상단의 **"..." (더보기)** 버튼을 클릭합니다

**단계 2: Connections 메뉴 접근**

1. 드롭다운 메뉴에서 **"Connections"** 또는 **"연결"**을 클릭합니다
2. "Add connections" 또는 "연결 추가" 버튼을 클릭합니다

**단계 3: Integration 선택**

1. 사용 가능한 Integration 목록에서 생성한 Integration을 찾습니다
2. Integration 이름 옆의 **"Connect"** 또는 **"연결"** 버튼을 클릭합니다

**단계 4: 권한 확인**

- Integration이 성공적으로 연결되면 "Connected" 상태로 표시됩니다
- 이제 해당 Integration이 데이터베이스에 접근할 수 있습니다

**💡 Integration을 찾을 수 없는 경우:**

- [Notion Developers](https://www.notion.so/my-integrations)에서 Integration이 제대로 생성되었는지 확인
- 같은 워크스페이스에서 Integration을 생성했는지 확인
- Integration이 "Active" 상태인지 확인

**⚠️ 주의사항:**

- Integration을 연결하지 않으면 API 호출 시 "object not found" 오류가 발생합니다
- 각 데이터베이스마다 개별적으로 Integration을 연결해야 합니다

#### 3.4 데이터베이스 ID 복사

데이터베이스 URL에서 ID를 복사하세요:

```
https://www.notion.so/your-workspace/DATABASE_ID?v=...
```

### 4. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env

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

```

### 5. 사이트 설정 커스터마이징

`src/config/site.ts` 파일을 수정하여 사이트 정보를 변경하세요:

```typescript
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
};
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
   - `NEXT_PUBLIC_SITE_URL` (배포된 도메인)
3. 배포 완료

## 사용법

### 블로그 포스트 작성

#### 📝 기본 포스트 작성 과정

1. **새 페이지 생성**

   - Notion 데이터베이스에서 "New" 버튼 클릭
   - 새로운 행(포스트) 생성

2. **필수 속성 입력**

   - **Title**: 포스트 제목 입력
   - **Slug**: URL 슬러그 입력 (예: "my-first-post", "react-tutorial")
   - **Published**: 🔶 **초안 단계에서는 체크하지 마세요**

3. **포스트 내용 작성**

   - 페이지를 열어서 내용을 마크다운 형식으로 작성
   - 이미지, 코드 블록, 리스트 등 자유롭게 사용 가능

4. **게시 과정**
   - 내용 작성 완료 후 **Published 체크박스를 체크**
   - 저장하면 자동으로 블로그에 반영 (보통 1-2분 소요)

#### 🔄 포스트 상태 관리

| 상태          | Published    | 설명                   | 블로그 표시 |
| ------------- | ------------ | ---------------------- | ----------- |
| **초안**      | ⬜ 체크 안됨 | 작성 중인 포스트       | ❌ 숨김     |
| **공개**      | ✅ 체크됨    | 완성된 포스트          | ✅ 표시     |
| **임시 숨김** | ⬜ 체크 해제 | 일시적으로 숨긴 포스트 | ❌ 숨김     |

#### 💡 포스트 작성 팁

- **Slug 작성 규칙**: 영문 소문자, 하이픈(-) 사용, 공백 없음
  - ✅ 좋은 예: "react-hooks-tutorial", "my-first-blog"
  - ❌ 나쁜 예: "React Hooks Tutorial", "내 첫 블로그"
- **Published 체크 타이밍**: 내용이 완전히 완성된 후에 체크
- **미리보기**: Published를 체크하기 전에 Notion에서 내용을 충분히 검토

#### 🗂️ 캐시 관리

**캐시 상태 확인**

```bash
# 브라우저에서 접속
http://localhost:3000/api/cache
```

**캐시 강제 새로고침**

```bash
curl -X POST http://localhost:3000/api/cache
```

**캐시 삭제**

```bash
curl -X DELETE http://localhost:3000/api/cache
```

**수동 캐시 삭제**

```bash
# 프로젝트 루트에서
rm -rf .cache
```

### 캐싱 시스템

**🚀 영구적 파일 시스템 캐시**

- **즉시 응답**: 캐시된 데이터를 먼저 표시하여 빠른 로딩
- **백그라운드 업데이트**: 사용자가 기다리지 않고 백그라운드에서 변경사항 확인
- **영구 저장**: 서버 재시작 후에도 캐시 유지 (`.cache` 디렉토리)
- **스마트 갱신**: Notion 원본이 변경된 경우에만 캐시 업데이트

**📁 캐시 파일 구조**

```
.cache/
├── posts.json      # 모든 포스트 데이터
└── metadata.json   # 캐시 메타데이터 (수정 시간 등)
```

**🔄 동작 방식**

1. **첫 방문**: Notion에서 데이터 가져와서 캐시에 저장
2. **재방문**: 캐시된 데이터 즉시 반환 (0.1초 이내)
3. **백그라운드**: Notion 변경사항 확인 후 필요시 캐시 업데이트
4. **오류 시**: 네트워크 오류가 발생해도 캐시된 데이터로 서비스 지속

**⚡ 성능 개선**

- **로딩 시간**: 3-5초 → 0.1초 (50배 빠름)
- **사용자 경험**: 즉시 콘텐츠 표시
- **안정성**: 네트워크 오류에도 서비스 지속

## 프로젝트 구조

```
src/
├── app/ # Next.js App Router 페이지
│ ├── api/ # API 라우트
│ ├── blog/ # 블로그 페이지
│ └── about/ # 소개 페이지
├── components/ # React 컴포넌트
├── config/ # 사이트 설정
├── lib/ # 유틸리티 함수
└── types/ # TypeScript 타입 정의
```

## 커스터마이징

### 스타일링

- `src/app/globals.css`: 글로벌 스타일
- `tailwind.config.js`: Tailwind 설정
- 컴포넌트별 스타일은 Tailwind 클래스 사용

### 기능 추가

- `src/config/site.ts`: 사이트 설정 수정
- `src/components/`: 새 컴포넌트 추가
- `src/lib/`: 유틸리티 함수 추가

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

```bash
npm run dev
```

콘솔에 "NOTION_DATABASE_ID is not set" 경고가 나타나지 않으면 성공!

## 문제 해결

### 일반적인 문제

1. **Notion API 오류**: Integration 토큰과 데이터베이스 권한 확인
2. **빌드 오류**: 환경 변수 설정 확인
3. **스타일 문제**: Tailwind CSS 설정 확인
4. **환경 변수 인식 안됨**: `.env.local` 파일 위치와 이름 확인
5. **데이터베이스 연결 실패**: Database ID와 Integration 권한 확인

### Published 속성 관련 문제

#### ❌ "Could not find property with name or id: Published" 오류

**원인**: Notion 데이터베이스에 "Published" 속성이 없음

**해결 방법 1 (권장)**: Published 속성 추가

1. Notion 데이터베이스로 이동
2. 새 속성 추가: 이름 "Published", 타입 "Checkbox"
3. 기존 포스트들의 Published 체크박스를 체크하여 공개

**⚠️ 중요**: Published 속성은 필수입니다

- Published 속성이 없으면 블로그가 정상 작동하지 않습니다
- 반드시 데이터베이스에 Published 속성을 추가해야 합니다

#### 📝 포스트가 블로그에 표시되지 않는 경우

**체크리스트**:

- [ ] **Title** 속성이 비어있지 않은지 확인
- [ ] **Slug** 속성이 비어있지 않은지 확인
- [ ] **Published** 체크박스가 체크되어 있는지 확인
- [ ] Integration이 데이터베이스에 연결되어 있는지 확인
- [ ] 브라우저 캐시를 새로고침 (Ctrl+F5 또는 Cmd+Shift+R)

#### 🔄 포스트 업데이트가 반영되지 않는 경우

**원인**: 캐싱으로 인한 지연

**해결 방법**:

- 1-2분 정도 기다린 후 새로고침
- 개발자 도구에서 "Disable cache" 옵션 활성화
- 브라우저 하드 리프레시 (Ctrl+Shift+R)

### 디버깅

개발자 도구의 콘솔에서 오류 메시지를 확인하세요.

## 🔒 보안

### 환경 변수 보안

**🛡️ 서버 전용 토큰 관리**

- `NOTION_TOKEN`과 `NOTION_DATABASE_ID`는 **서버에서만** 사용됩니다
- 클라이언트(브라우저)에는 **절대 노출되지 않습니다**
- 모든 Notion API 호출은 **백엔드 API 라우트**를 통해서만 처리됩니다

**🔍 보안 검증 방법**

브라우저 개발자 도구에서 다음을 확인하세요:

1. **Network 탭**: Notion API 직접 호출이 없어야 함
2. **Console 탭**: NOTION_TOKEN 관련 오류가 없어야 함
3. **Sources 탭**: 클라이언트 코드에 토큰이 포함되지 않아야 함

**📊 환경 변수 상태 확인**

```bash
# 환경 변수 설정 상태 확인
curl http://localhost:3000/api/env-status
```

**🚨 보안 주의사항**

- `.env.local` 파일을 **절대 Git에 커밋하지 마세요**
- `NOTION_TOKEN`을 **공개 저장소에 업로드하지 마세요**
- 프로덕션 환경에서는 **환경 변수를 안전하게 관리**하세요

**🔧 Vercel 배포 시 환경 변수 설정**

1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables
3. `NOTION_TOKEN`과 `NOTION_DATABASE_ID` 추가
4. Production, Preview, Development 환경 모두 설정

### 파일 시스템 보안

**📁 캐시 파일 보안**

- `.cache` 디렉토리는 `.gitignore`에 포함되어 있습니다
- 캐시 파일에는 민감한 정보가 포함되지 않습니다
- 서버 재시작 시에도 안전하게 캐시가 유지됩니다

## 라이선스

MIT License

## 기여

이슈나 풀 리퀘스트를 통해 기여해주세요!
