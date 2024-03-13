import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostgresqlPrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    super();
  }

  /**
   * The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database.
   */
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}