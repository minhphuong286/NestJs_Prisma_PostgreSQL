import { Module } from '@nestjs/common';
import { AppConfigModule } from './configs/app/config.module';
import { DBConfigModule } from './configs/database/postgresql/config.module';
import { PostgreSqlPrismaModule } from './providers/postgresql/postgresql.prisma.module';

@Module({
  imports: [
    AppConfigModule, 
    DBConfigModule,
    PostgreSqlPrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
