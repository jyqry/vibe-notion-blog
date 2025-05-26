import { BlogPost } from "@/types/notion";

interface CacheMetadata {
  lastUpdated: string;
  postsLastModified: { [postId: string]: string };
  databaseLastModified: string;
}

interface PostsCache {
  posts: BlogPost[];
  metadata: CacheMetadata;
}

export class CacheManager {
  private memoryCache: PostsCache | null = null;
  private isVercel: boolean;

  constructor() {
    // Vercel 환경 감지
    this.isVercel =
      process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    if (!this.isVercel) {
      // 로컬 환경에서만 파일 시스템 캐시 시도
      this.loadFromFileSystem();
    }
  }

  private loadFromFileSystem() {
    try {
      const fs = require("fs");
      const path = require("path");

      const CACHE_DIR = path.join(process.cwd(), ".cache");
      const POSTS_CACHE_FILE = path.join(CACHE_DIR, "posts.json");

      if (fs.existsSync(POSTS_CACHE_FILE)) {
        const cacheData = fs.readFileSync(POSTS_CACHE_FILE, "utf-8");
        this.memoryCache = JSON.parse(cacheData);
        console.log(
          `파일 시스템에서 ${
            this.memoryCache?.posts.length || 0
          }개 포스트 로드됨`
        );
      }
    } catch (error) {
      console.warn("파일 시스템 캐시 로드 실패, 메모리 캐시만 사용:", error);
    }
  }

  private saveToFileSystem() {
    if (this.isVercel || !this.memoryCache) return;

    try {
      const fs = require("fs");
      const path = require("path");

      const CACHE_DIR = path.join(process.cwd(), ".cache");
      const POSTS_CACHE_FILE = path.join(CACHE_DIR, "posts.json");
      const METADATA_CACHE_FILE = path.join(CACHE_DIR, "metadata.json");

      // 디렉토리 생성
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }

      fs.writeFileSync(
        POSTS_CACHE_FILE,
        JSON.stringify(this.memoryCache, null, 2)
      );
      fs.writeFileSync(
        METADATA_CACHE_FILE,
        JSON.stringify(this.memoryCache.metadata, null, 2)
      );

      console.log(
        `${this.memoryCache.posts.length}개 포스트가 파일 시스템에 저장됨`
      );
    } catch (error) {
      console.warn("파일 시스템 저장 실패:", error);
    }
  }

  // 포스트 캐시 읽기
  getCachedPosts(): BlogPost[] | null {
    try {
      if (!this.memoryCache) {
        return null;
      }

      console.log(
        `메모리 캐시에서 ${this.memoryCache.posts.length}개 포스트 반환`
      );
      return this.memoryCache.posts;
    } catch (error) {
      console.error("캐시 읽기 오류:", error);
      return null;
    }
  }

  // 포스트 캐시 저장
  setCachedPosts(posts: BlogPost[], metadata: CacheMetadata) {
    try {
      this.memoryCache = {
        posts,
        metadata,
      };

      // 로컬 환경에서만 파일 시스템에도 저장
      this.saveToFileSystem();

      console.log(
        `${posts.length}개 포스트가 메모리 캐시에 저장됨 (Vercel: ${this.isVercel})`
      );
    } catch (error) {
      console.error("캐시 저장 오류:", error);
    }
  }

  // 메타데이터 읽기
  getCachedMetadata(): CacheMetadata | null {
    try {
      return this.memoryCache?.metadata || null;
    } catch (error) {
      console.error("메타데이터 읽기 오류:", error);
      return null;
    }
  }

  // 개별 포스트 캐시 읽기
  getCachedPost(slug: string): BlogPost | null {
    try {
      const posts = this.getCachedPosts();
      if (!posts) return null;

      return posts.find((post) => post.slug === slug) || null;
    } catch (error) {
      console.error("개별 포스트 캐시 읽기 오류:", error);
      return null;
    }
  }

  // 개별 포스트 캐시 업데이트
  updateCachedPost(updatedPost: BlogPost) {
    try {
      if (!this.memoryCache) return;

      const posts = this.memoryCache.posts;
      const postIndex = posts.findIndex((post) => post.id === updatedPost.id);

      if (postIndex >= 0) {
        posts[postIndex] = updatedPost;
      } else {
        posts.push(updatedPost);
      }

      // 메타데이터도 함께 업데이트
      this.memoryCache.metadata.postsLastModified[updatedPost.id] =
        updatedPost.updatedAt;
      this.memoryCache.metadata.lastUpdated = new Date().toISOString();

      // 로컬 환경에서만 파일 시스템에도 저장
      this.saveToFileSystem();

      console.log(`포스트 "${updatedPost.title}" 메모리 캐시 업데이트됨`);
    } catch (error) {
      console.error("개별 포스트 캐시 업데이트 오류:", error);
    }
  }

  // 캐시 무효화 (전체 삭제)
  invalidateCache() {
    try {
      this.memoryCache = null;

      // 로컬 환경에서만 파일 시스템 캐시도 삭제
      if (!this.isVercel) {
        try {
          const fs = require("fs");
          const path = require("path");

          const CACHE_DIR = path.join(process.cwd(), ".cache");
          const POSTS_CACHE_FILE = path.join(CACHE_DIR, "posts.json");
          const METADATA_CACHE_FILE = path.join(CACHE_DIR, "metadata.json");

          if (fs.existsSync(POSTS_CACHE_FILE)) {
            fs.unlinkSync(POSTS_CACHE_FILE);
          }
          if (fs.existsSync(METADATA_CACHE_FILE)) {
            fs.unlinkSync(METADATA_CACHE_FILE);
          }
        } catch (error) {
          console.warn("파일 시스템 캐시 삭제 실패:", error);
        }
      }

      console.log("캐시가 무효화됨 (메모리 + 파일 시스템)");
    } catch (error) {
      console.error("캐시 무효화 오류:", error);
    }
  }

  // 캐시 상태 확인
  getCacheStatus() {
    const hasCache = !!this.memoryCache;
    const metadata = this.getCachedMetadata();

    return {
      hasCachedPosts: hasCache,
      hasCachedMetadata: hasCache,
      lastUpdated: metadata?.lastUpdated || null,
      postsCount: this.memoryCache?.posts.length || 0,
      environment: this.isVercel ? "vercel" : "local",
    };
  }
}

export const cacheManager = new CacheManager();
