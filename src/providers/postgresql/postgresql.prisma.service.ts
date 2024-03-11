import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DBConfigService } from 'src/configs/database/postgresql/config.service';


@Injectable()
export class PostgreSqlPrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(
    dbConfigService: DBConfigService
  ) {
    super({
      datasources: {
        db: {
          url: dbConfigService.url
        },
      },
    });
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
