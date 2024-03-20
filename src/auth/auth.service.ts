import { Injectable, UnauthorizedException } from '@nestjs/common';
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ValidationErrorException } from 'src/common/exceptions';
import { LoginDto, RefreshDto, RegisterDto } from './dto';
import { PostgresqlPrismaService } from 'src/providers/postgresql-prisma/postgresql-prisma.service';
import { UserService, roundsOfHashing } from 'src/modules/user/services';
import { TCreateToken, TPayload } from './types';
import { hashIds } from 'src/common/helpers';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { JwtConfigService } from 'src/configs/jwt-config/config.service';

@Injectable()
export class AuthService {
    constructor(
        private postgresqlPrismaService: PostgresqlPrismaService,
        private userService: UserService,
        private jwtConfigService: JwtConfigService,
        private jwt: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const { username, email, phone, password, deviceName } = registerDto;

        const isEmailUsed = await this.postgresqlPrismaService.user.findUnique({ where: { email } });
        const isUsernameUsed = await this.postgresqlPrismaService.user.findUnique({ where: { username } });
        const isPhoneUsed = await this.postgresqlPrismaService.user.findUnique({ where: { phone } });

        if (isEmailUsed || isUsernameUsed || isPhoneUsed) {
            const errorMessage = 'This field has already been taken.';
            const error: Record<string, string> = {};
            if (isEmailUsed) error['email'] = errorMessage;
            if (isUsernameUsed) error['username'] = errorMessage;
            if (isPhoneUsed) error['phone'] = errorMessage;
            throw new ValidationErrorException(error);
        }

        const hashedPassword = await bcrypt.hash(password, roundsOfHashing);
        const createdUser = await this.postgresqlPrismaService.user.create({
            data: {
                username,
                email,
                phone,
                password: hashedPassword
            },
        });
        return {
            user: new UserEntity(createdUser),
            accessToken: await this.createToken({ userId: createdUser.id, deviceName }, false),
            refreshToken: await this.createToken({ userId: createdUser.id, deviceName }, true),
        }
    }

    private async createToken(data: TCreateToken, isRefreshToken: boolean) {
        const token = crypto.randomBytes(20).toString('hex');
        const hashedToken = await bcrypt.hash(token, roundsOfHashing);
        const accessToken = await this.postgresqlPrismaService.token.create({
            data: { token: hashedToken, userId: data.userId, name: data.deviceName },
        });

        const payload: TPayload = { sub: hashIds.encode(accessToken.id), token };

        if (isRefreshToken) {
            return this.jwt.sign(payload, { secret: this.jwtConfigService.secretRefresh, expiresIn: this.jwtConfigService.expireTimeRefresh });
        }
        return this.jwt.sign(payload, { secret: this.jwtConfigService.secretAccess, expiresIn: this.jwtConfigService.expireTimeAccess });
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userService.findUnique(username);

        if (!user) this.throwInvalidCredentials();
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) this.throwInvalidCredentials();

        return {
            user: new UserEntity(user),
            accessToken: await this.createToken({ userId: user.id, deviceName: loginDto.deviceName }, false),
            refreshToken: await this.createToken({ userId: user.id, deviceName: loginDto.deviceName }, true),
        };
    }
    private throwInvalidCredentials() {
        throw new ValidationErrorException({
            message: "These credentials doesn't match our records.",
        });
    }

    async refresh(refreshDto: RefreshDto) {
        try{
            this.jwt.verify(refreshDto.refreshToken, { secret: this.jwtConfigService.secretRefresh });
        }catch(e){
            if ((e as Error).name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            throw new UnauthorizedException();
        }

        const payload = this.jwt.decode(refreshDto.refreshToken);
        const id = hashIds.decode(payload.sub)[0] as number;
        const token = await this.postgresqlPrismaService.token.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!token) throw new UnauthorizedException();
        const tokenMatches = await bcrypt.compare(payload.token, token.token);
        if (!tokenMatches) throw new UnauthorizedException();

        // Neet to update with device indentify that user logging in.
        const accessToken = await this.createToken({ userId: token.userId, deviceName: refreshDto.deviceName }, false);
        return accessToken;
    }

    async logout(data: any) {
        // Neet to update with device indentify that user logging in.
        return await this.postgresqlPrismaService.token.deleteMany({ where: { userId: +data.userId } });
    }

}
