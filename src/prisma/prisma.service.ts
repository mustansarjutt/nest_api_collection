import { Injectable, OnModuleInit, OnModuleDestroy, Logger, INestApplication } from "@nestjs/common";
import { PrismaClient } from "src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("Prisma");

  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>("DATABASE_URL");
    const pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      keepAlive: true
    });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ["error", "warn"]
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("✅ Database connected successfully");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.warn("❌ Database disconnected");
  }

  enableShutdownHooks(app: INestApplication) {
    const shutdown = async () => app.close();
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
}