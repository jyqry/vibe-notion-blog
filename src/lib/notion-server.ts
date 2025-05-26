import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { NotionPage, BlogPost } from "@/types/notion";
import { cacheManager } from "./cache-manager";
import { serverEnv } from "./env-server";

const notion = new Client({
  auth: serverEnv.notionToken,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export class NotionServerService {
  private databaseId: string;

  constructor() {
    this.databaseId = serverEnv.notionDatabaseId;
    if (!this.databaseId) {
      console.warn(
        "NOTION_DATABASE_ID is not set. Please create .env.local file with your Notion credentials."
      );
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      if (!this.databaseId) {
        console.warn("No database ID configured. Returning empty array.");
        return [];
      }

      // Vercel 환경에서는 캐시가 요청 간에 유지되지 않으므로 직접 데이터 가져오기
      const isVercel =
        process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

      if (isVercel) {
        console.log("Vercel 환경: Notion에서 직접 데이터 가져오는 중...");
        return await this.fetchPostsFromNotion();
      }

      // 로컬 환경에서는 기존 캐시 로직 사용
      const cachedPosts = cacheManager.getCachedPosts();

      // 백그라운드에서 업데이트 확인 및 캐시 갱신
      this.checkAndUpdateCache().catch((error) => {
        console.error("백그라운드 캐시 업데이트 오류:", error);
      });

      // 캐시가 있으면 즉시 반환, 없으면 실시간 데이터 가져오기
      if (cachedPosts && cachedPosts.length > 0) {
        console.log(`캐시에서 ${cachedPosts.length}개 포스트 반환 (즉시 응답)`);
        return cachedPosts;
      }

      // 캐시가 없는 경우에만 실시간으로 데이터 가져오기
      console.log("캐시가 없어서 Notion에서 실시간 데이터 가져오는 중...");
      return await this.fetchPostsFromNotion();
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      // 오류 발생 시 빈 배열 반환
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const isVercel =
        process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

      if (isVercel) {
        // Vercel 환경에서는 직접 Notion에서 가져오기
        console.log(
          `Vercel 환경: 포스트 "${slug}" Notion에서 직접 가져오는 중...`
        );
        return await this.fetchPostBySlugFromNotion(slug);
      }

      // 로컬 환경에서는 캐시 우선 로직 사용
      const cachedPost = cacheManager.getCachedPost(slug);

      if (cachedPost) {
        console.log(`캐시에서 포스트 "${slug}" 반환 (즉시 응답)`);

        // 백그라운드에서 개별 포스트 업데이트 확인
        this.checkAndUpdateSinglePost(cachedPost.id, slug).catch((error) => {
          console.error("백그라운드 포스트 업데이트 오류:", error);
        });

        return cachedPost;
      }

      // 캐시에 없으면 실시간으로 가져오기
      console.log(`캐시에 없는 포스트 "${slug}", Notion에서 가져오는 중...`);
      return await this.fetchPostBySlugFromNotion(slug);
    } catch (error) {
      console.error("Error in getPostBySlug:", error);
      return null;
    }
  }

  // Notion에서 실시간으로 포스트 가져오기
  private async fetchPostsFromNotion(): Promise<BlogPost[]> {
    // 데이터베이스 스키마 확인
    const database = await notion.databases.retrieve({
      database_id: this.databaseId,
    });
    const properties = (database as any).properties;
    const hasPublished = "Published" in properties;
    const hasCreated = "Created" in properties;

    console.log("Available properties:", Object.keys(properties));
    console.log("Has Published property:", hasPublished);
    console.log("Has Created property:", hasCreated);

    // Published 속성이 없으면 오류 발생
    if (!hasPublished) {
      throw new Error(
        "Published property is required in the Notion database. Please add a 'Published' checkbox property to your database."
      );
    }

    // 쿼리 옵션 구성 - Published가 체크된 포스트만 가져오기
    const queryOptions: any = {
      database_id: this.databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    };

    // Created 속성이 있으면 정렬 추가
    if (hasCreated) {
      queryOptions.sorts = [
        {
          property: "Created",
          direction: "descending",
        },
      ];
    }

    const response = await notion.databases.query(queryOptions);

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        return await this.pageToPost(page);
      })
    );

    const validPosts = posts.filter(Boolean) as BlogPost[];

    // 캐시에 저장
    const metadata = {
      lastUpdated: new Date().toISOString(),
      postsLastModified: validPosts.reduce((acc, post) => {
        acc[post.id] = post.updatedAt;
        return acc;
      }, {} as { [key: string]: string }),
      databaseLastModified: (database as any).last_edited_time,
    };

    cacheManager.setCachedPosts(validPosts, metadata);

    return validPosts;
  }

  // Notion에서 실시간으로 개별 포스트 가져오기
  private async fetchPostBySlugFromNotion(
    slug: string
  ): Promise<BlogPost | null> {
    if (!this.databaseId) {
      console.warn("No database ID configured. Returning null.");
      return null;
    }

    // 데이터베이스 스키마 확인
    const database = await notion.databases.retrieve({
      database_id: this.databaseId,
    });
    const properties = (database as any).properties;
    const hasPublished = "Published" in properties;
    const hasSlug = "Slug" in properties;

    if (!hasSlug) {
      console.error("Database does not have 'Slug' property");
      return null;
    }

    // Published 속성이 없으면 오류 발생
    if (!hasPublished) {
      throw new Error(
        "Published property is required in the Notion database. Please add a 'Published' checkbox property to your database."
      );
    }

    // 필터 구성 - Slug와 Published 모두 확인
    const response = await notion.databases.query({
      database_id: this.databaseId,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    const post = await this.pageToPost(page as any);

    // 캐시에 저장
    if (post) {
      cacheManager.updateCachedPost(post);
    }

    return post;
  }

  // 백그라운드에서 캐시 업데이트 확인
  private async checkAndUpdateCache(): Promise<void> {
    try {
      const cachedMetadata = cacheManager.getCachedMetadata();
      if (!cachedMetadata) {
        // 메타데이터가 없으면 전체 새로고침
        await this.fetchPostsFromNotion();
        return;
      }

      // 데이터베이스 최종 수정 시간 확인
      const database = await notion.databases.retrieve({
        database_id: this.databaseId,
      });
      const currentDbLastModified = (database as any).last_edited_time;

      // 데이터베이스가 수정되었는지 확인
      if (currentDbLastModified !== cachedMetadata.databaseLastModified) {
        console.log("데이터베이스 변경 감지됨, 캐시 업데이트 중...");
        await this.fetchPostsFromNotion();
      } else {
        console.log("데이터베이스 변경사항 없음, 캐시 유지");
      }
    } catch (error) {
      console.error("캐시 업데이트 확인 중 오류:", error);
    }
  }

  // 백그라운드에서 개별 포스트 업데이트 확인
  private async checkAndUpdateSinglePost(
    postId: string,
    slug: string
  ): Promise<void> {
    try {
      const cachedMetadata = cacheManager.getCachedMetadata();
      if (!cachedMetadata) return;

      // 개별 포스트의 최종 수정 시간 확인
      const page = await notion.pages.retrieve({ page_id: postId });
      const currentPostLastModified = (page as any).last_edited_time;
      const cachedPostLastModified = cachedMetadata.postsLastModified[postId];

      // 포스트가 수정되었는지 확인
      if (currentPostLastModified !== cachedPostLastModified) {
        console.log(`포스트 "${slug}" 변경 감지됨, 캐시 업데이트 중...`);
        const updatedPost = await this.fetchPostBySlugFromNotion(slug);
        if (updatedPost) {
          cacheManager.updateCachedPost(updatedPost);
        }
      } else {
        console.log(`포스트 "${slug}" 변경사항 없음, 캐시 유지`);
      }
    } catch (error) {
      console.error("개별 포스트 캐시 업데이트 확인 중 오류:", error);
    }
  }

  async getPostContent(pageId: string): Promise<string> {
    try {
      const mdblocks = await n2m.pageToMarkdown(pageId);
      const mdString = n2m.toMarkdownString(mdblocks);
      return mdString.parent;
    } catch (error) {
      console.error("Error fetching post content:", error);
      return "";
    }
  }

  private async pageToPost(page: any): Promise<BlogPost | null> {
    try {
      const properties = page.properties;

      // 필수 속성 확인
      if (!properties.Title || !properties.Slug || !properties.Published) {
        console.warn(
          "Page missing required properties (Title, Slug, Published):",
          page.id
        );
        return null;
      }

      // Published가 체크되지 않은 포스트는 제외
      const published = this.getPropertyValue(properties.Published);
      if (!published) {
        console.warn("Post is not published:", page.id);
        return null;
      }

      const title = this.getPropertyValue(properties.Title);
      const slug = this.getPropertyValue(properties.Slug);

      if (!title || !slug) {
        return null;
      }

      const content = await this.getPostContent(page.id);

      const post: BlogPost = {
        id: page.id,
        title,
        slug,
        content,
        excerpt:
          this.getPropertyValue(properties.Excerpt) ||
          this.generateExcerpt(content),
        coverImage: this.getCoverImage(page),
        tags: this.getPropertyValue(properties.Tags) || [],
        publishedAt:
          this.getPropertyValue(properties.Created) || page.created_time,
        updatedAt:
          this.getPropertyValue(properties.Updated) || page.last_edited_time,
        published: this.getPropertyValue(properties.Published) || false,
        author: this.getPropertyValue(properties.Author),
        category: this.getPropertyValue(properties.Category),
        featured: this.getPropertyValue(properties.Featured) || false,
        readingTime: this.calculateReadingTime(content),
      };

      return post;
    } catch (error) {
      console.error("Error converting page to post:", error);
      return null;
    }
  }

  private getPropertyValue(property: any): any {
    if (!property) return null;

    switch (property.type) {
      case "title":
        return property.title?.[0]?.plain_text || "";
      case "rich_text":
        return property.rich_text?.[0]?.plain_text || "";
      case "checkbox":
        return property.checkbox;
      case "date":
        return property.date?.start || null;
      case "multi_select":
        return property.multi_select?.map((item: any) => item.name) || [];
      case "select":
        return property.select?.name || null;
      case "people":
        return property.people?.[0]?.name || null;
      default:
        return null;
    }
  }

  private getCoverImage(page: any): string | undefined {
    if (page.cover?.type === "external") {
      return page.cover.external.url;
    }
    if (page.cover?.type === "file") {
      return page.cover.file.url;
    }
    return undefined;
  }

  private generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/[#*`\[\]]/g, "").trim();
    if (plainText.length <= maxLength) {
      return plainText;
    }
    return plainText.substring(0, maxLength).trim() + "...";
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  async getPageLastModified(pageId: string): Promise<string> {
    try {
      const page = await notion.pages.retrieve({ page_id: pageId });
      return (page as any).last_edited_time;
    } catch (error) {
      console.error("Error fetching page last modified:", error);
      return new Date().toISOString();
    }
  }
}

export const notionServerService = new NotionServerService();
