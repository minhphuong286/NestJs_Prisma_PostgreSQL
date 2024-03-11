import { Module } from '@nestjs/common';
import { PostgreSqlPrismaService } from './postgresql.prisma.service';
import { DBConfigModule } from 'src/configs/database/postgresql/config.module';

/**
 * See optional instruction for global modules https://docs.nestjs.com/modules#global-modules
 */
@Module({
  imports: [DBConfigModule],
  providers: [PostgreSqlPrismaService],
  exports: [PostgreSqlPrismaService],
})
export class PostgreSqlPrismaModule {}
