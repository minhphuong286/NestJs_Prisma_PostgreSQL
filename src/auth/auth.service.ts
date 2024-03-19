import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ValidationErrorException } from 'src/common/exceptions';
import { LoginDto, RegisterDto } from './dto';
import { PostgresqlPrismaService } from 'src/providers/postgresql-prisma/postgresql-prisma.service';
import { UserService, roundsOfHashing } from 'src/modules/user/services';
import { TCreateToken, TPayload } from './types';
import { hashIds } from 'src/common/helpers';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private postgresqlPrismaService: PostgresqlPrismaService,
        private userService: UserService,
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
            accessToken: await this.createToken({ userId: createdUser.id, deviceName })
        }
    }

    private async createToken(data: TCreateToken) {
        const token = crypto.randomBytes(20).toString('hex');
        const hashedToken = await bcrypt.hash(token, roundsOfHashing);
        const accessToken = await this.postgresqlPrismaService.token.create({
            data: { token: hashedToken, userId: data.userId, name: data.deviceName },
        });

        const payload: TPayload = { sub: hashIds.encode(accessToken.id), token };
        return this.jwt.sign(payload);
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userService.findUnique(username);

        if (!user) this.throwInvalidCredentials();
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) this.throwInvalidCredentials();

        return {
            user: new UserEntity(user),
            accessToken: await this.createToken({ userId: user.id, deviceName: loginDto.deviceName }),
        };
    }
    private throwInvalidCredentials() {
        throw new ValidationErrorException({
            email: "These credentials doesn't match our records.",
        });
    }

    logout(data: any) {
        return this.postgresqlPrismaService.token.delete({ where: { id: +data.id } });
    }

}
