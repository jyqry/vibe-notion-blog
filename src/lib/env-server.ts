/**
 * 서버 전용 환경 변수 관리
 * 클라이언트에서는 절대 import하지 마세요!
 */

// 서버 환경에서만 실행되는지 확인
if (typeof window !== "undefined") {
  throw new Error(
    "🚨 보안 경고: env-server.ts는 서버에서만 사용해야 합니다! 클라이언트에서 import하지 마세요."
  );
}

interface ServerEnvConfig {
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
  NODE_ENV: string;
}

class ServerEnvManager {
  private config: ServerEnvConfig;

  constructor() {
    this.config = this.validateAndLoadEnv();
  }

  private validateAndLoadEnv(): ServerEnvConfig {
    const requiredEnvVars = {
      NOTION_TOKEN: process.env.NOTION_TOKEN,
      NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
      NODE_ENV: process.env.NODE_ENV || "development",
    };

    // 개발 환경에서는 경고만 출력
    if (requiredEnvVars.NODE_ENV === "development") {
      if (!requiredEnvVars.NOTION_TOKEN) {
        console.warn(
          "⚠️  NOTION_TOKEN이 설정되지 않았습니다. .env.local 파일을 확인하세요."
        );
      }
      if (!requiredEnvVars.NOTION_DATABASE_ID) {
        console.warn(
          "⚠️  NOTION_DATABASE_ID가 설정되지 않았습니다. .env.local 파일을 확인하세요."
        );
      }
    }

    // 프로덕션 환경에서는 필수 환경 변수 검증
    if (requiredEnvVars.NODE_ENV === "production") {
      const missingVars = Object.entries(requiredEnvVars)
        .filter(([key, value]) => key !== "NODE_ENV" && !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        throw new Error(
          `🚨 필수 환경 변수가 누락되었습니다: ${missingVars.join(", ")}`
        );
      }
    }

    return requiredEnvVars as ServerEnvConfig;
  }

  get notionToken(): string {
    return this.config.NOTION_TOKEN || "";
  }

  get notionDatabaseId(): string {
    return this.config.NOTION_DATABASE_ID || "";
  }

  get nodeEnv(): string {
    return this.config.NODE_ENV;
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === "production";
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === "development";
  }

  // 환경 변수 상태 확인
  getStatus() {
    return {
      hasNotionToken: !!this.config.NOTION_TOKEN,
      hasNotionDatabaseId: !!this.config.NOTION_DATABASE_ID,
      nodeEnv: this.config.NODE_ENV,
      isConfigured: !!(
        this.config.NOTION_TOKEN && this.config.NOTION_DATABASE_ID
      ),
    };
  }
}

// 싱글톤 인스턴스
export const serverEnv = new ServerEnvManager();

// 개별 환경 변수 접근 함수들
export const getNotionToken = () => serverEnv.notionToken;
export const getNotionDatabaseId = () => serverEnv.notionDatabaseId;
export const isProduction = () => serverEnv.isProduction;
export const isDevelopment = () => serverEnv.isDevelopment;
