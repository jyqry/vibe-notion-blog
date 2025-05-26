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
    this.databaseId = process.env.NOTION_DATABASE_ID!;
    if (!this.databaseId) {
      throw new Error("NOTION_DATABASE_ID is required");
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: "Created",
            direction: "descending",
          },
        ],
      });

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
      if (!properties.Title || !properties.Slug) {
        console.warn("Page missing required properties:", page.id);
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
