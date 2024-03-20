import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresqlPrismaModule } from 'src/providers/postgresql-prisma/postgresql-prisma.module';
import { JwtConfigModule } from 'src/configs/jwt-config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    PostgresqlPrismaModule, 
    UserModule,
    JwtConfigModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
