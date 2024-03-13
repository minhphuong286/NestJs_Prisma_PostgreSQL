import { Module } from '@nestjs/common';
import { AppConfigModule } from './configs/app/config.module';
import { DBConfigModule } from './configs/database/postgresql/config.module';
import { PostgresqlPrismaModule } from './providers/postgresql-prisma/postgresql-prisma.module';

@Module({
  imports: [
    AppConfigModule, 
    DBConfigModule,
    PostgresqlPrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
