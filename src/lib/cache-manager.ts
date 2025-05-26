import fs from "fs";
import path from "path";
import { BlogPost } from "@/types/notion";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const POSTS_CACHE_FILE = path.join(CACHE_DIR, "posts.json");
const METADATA_CACHE_FILE = path.join(CACHE_DIR, "metadata.json");

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
  constructor() {
    this.ensureCacheDir();
  }

  private ensureCacheDir() {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  // 포스트 캐시 읽기
  getCachedPosts(): BlogPost[] | null {
    try {
      if (!fs.existsSync(POSTS_CACHE_FILE)) {
        return null;
      }

      const cacheData = fs.readFileSync(POSTS_CACHE_FILE, "utf-8");
      const parsedData: PostsCache = JSON.parse(cacheData);

      console.log(`캐시에서 ${parsedData.posts.length}개 포스트 로드됨`);
      return parsedData.posts;
    } catch (error) {
      console.error("캐시 읽기 오류:", error);
      return null;
    }
  }

  // 포스트 캐시 저장
  setCachedPosts(posts: BlogPost[], metadata: CacheMetadata) {
    try {
      const cacheData: PostsCache = {
        posts,
        metadata,
      };

      fs.writeFileSync(POSTS_CACHE_FILE, JSON.stringify(cacheData, null, 2));
      fs.writeFileSync(METADATA_CACHE_FILE, JSON.stringify(metadata, null, 2));

      console.log(`${posts.length}개 포스트가 캐시에 저장됨`);
    } catch (error) {
      console.error("캐시 저장 오류:", error);
    }
  }

  // 메타데이터 읽기
  getCachedMetadata(): CacheMetadata | null {
    try {
      if (!fs.existsSync(METADATA_CACHE_FILE)) {
        return null;
      }

      const metadataData = fs.readFileSync(METADATA_CACHE_FILE, "utf-8");
      return JSON.parse(metadataData);
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
      const posts = this.getCachedPosts();
      if (!posts) return;

      const postIndex = posts.findIndex((post) => post.id === updatedPost.id);

      if (postIndex >= 0) {
        posts[postIndex] = updatedPost;
      } else {
        posts.push(updatedPost);
      }

      // 메타데이터도 함께 업데이트
      const metadata = this.getCachedMetadata() || {
        lastUpdated: new Date().toISOString(),
        postsLastModified: {},
        databaseLastModified: new Date().toISOString(),
      };

      metadata.postsLastModified[updatedPost.id] = updatedPost.updatedAt;
      metadata.lastUpdated = new Date().toISOString();

      this.setCachedPosts(posts, metadata);
      console.log(`포스트 "${updatedPost.title}" 캐시 업데이트됨`);
    } catch (error) {
      console.error("개별 포스트 캐시 업데이트 오류:", error);
    }
  }

  // 캐시 무효화 (전체 삭제)
  invalidateCache() {
    try {
      if (fs.existsSync(POSTS_CACHE_FILE)) {
        fs.unlinkSync(POSTS_CACHE_FILE);
      }
      if (fs.existsSync(METADATA_CACHE_FILE)) {
        fs.unlinkSync(METADATA_CACHE_FILE);
      }
      console.log("캐시가 무효화됨");
    } catch (error) {
      console.error("캐시 무효화 오류:", error);
    }
  }

  // 캐시 상태 확인
  getCacheStatus() {
    const postsExist = fs.existsSync(POSTS_CACHE_FILE);
    const metadataExist = fs.existsSync(METADATA_CACHE_FILE);
    const metadata = this.getCachedMetadata();

    return {
      hasCachedPosts: postsExist,
      hasCachedMetadata: metadataExist,
      lastUpdated: metadata?.lastUpdated || null,
      postsCount: this.getCachedPosts()?.length || 0,
    };
  }
}

export const cacheManager = new CacheManager();
