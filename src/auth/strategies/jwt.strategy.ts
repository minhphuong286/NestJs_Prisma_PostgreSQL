import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as bcrypt from 'bcrypt';
import { PostgresqlPrismaService } from "src/providers/postgresql-prisma/postgresql-prisma.service";
import { TPayload } from "../types";
import { hashIds } from "src/common/helpers";
import { JwtConfigService } from "src/configs/jwt-config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private postgresqlPrismaService: PostgresqlPrismaService,
    jwtConfigService: JwtConfigService
  ) {
    super({
      secretOrKey: jwtConfigService.secret,
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: TPayload) {
    const id = hashIds.decode(payload.sub)[0] as number;
    const accessToken = await this.postgresqlPrismaService.token.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!accessToken) throw new UnauthorizedException();
    const tokenMatches = await bcrypt.compare(payload.token, accessToken.token);
    if (!tokenMatches) throw new UnauthorizedException();

    return accessToken;
  }
}