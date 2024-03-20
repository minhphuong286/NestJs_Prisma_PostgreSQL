import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
    constructor(private configService: ConfigService) {}

    get secretAccess(): string {
      return this.configService.get<string>('jwt.secretAccess') ?? '';
    }
    get expireTimeAccess(): string {
      return this.configService.get<string>('jwt.expireTimeAccess') ?? '';
    }
    get secretRefresh(): string {
      return this.configService.get<string>('jwt.secretRefresh') ?? '';
    }
    get expireTimeRefresh(): string {
      return this.configService.get<string>('jwt.expireTimeRefresh') ?? '';
    }
}
