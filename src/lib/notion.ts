import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { NotionPage, BlogPost } from "@/types/notion";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export class NotionService {
  private databaseId: string;

  constructor() {
    this.databaseId = process.env.NOTION_DATABASE_ID || "";
    if (!this.databaseId) {
      console.warn(
        "NOTION_DATABASE_ID is not set. Please create .env.local file with your Notion credentials."
      );
      // 개발 환경에서는 빈 배열을 반환하도록 함
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      if (!this.databaseId) {
        console.warn("No database ID configured. Returning empty posts array.");
        return [];
      }

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

      return posts.filter(Boolean) as BlogPost[];
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
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
      return await this.pageToPost(page as any);
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      return null;
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

export const notionService = new NotionService();
