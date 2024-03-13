import { Module } from '@nestjs/common';
import { PostgresqlPrismaService } from './postgresql-prisma.service';

@Module({
  providers: [PostgresqlPrismaService],
  exports: [PostgresqlPrismaService]
})
export class PostgresqlPrismaModule {}
