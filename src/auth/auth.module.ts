import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigService } from 'src/configs/jwt-config/config.service';
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
    JwtModule.registerAsync({
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: process.env.JWT_SECRET,
        // secret: jwtConfigService.secret,
        signOptions: { expiresIn: '15m' },
      }),
      inject: [],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
