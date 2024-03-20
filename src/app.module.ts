import { Module } from '@nestjs/common';
import { AppConfigModule } from './configs/app/config.module';
import { DBConfigModule } from './configs/database/postgresql/config.module';
import { PostgresqlPrismaModule } from './providers/postgresql-prisma/postgresql-prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';
import { JwtConfigModule } from './configs/jwt-config/config.module';

@Module({
  imports: [
    AppConfigModule, 
    DBConfigModule,
    PostgresqlPrismaModule,
    JwtConfigModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],

})
export class AppModule { }
