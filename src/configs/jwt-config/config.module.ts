import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

import { getEnvironmentPath } from 'src/common/helpers/environment.helper';
import { ENVIRONMENT_PATH } from 'src/common/constants/constants';
import { JwtConfigService } from './config.service';

const envFilePath: string = getEnvironmentPath(ENVIRONMENT_PATH);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [configuration],
      validationSchema: Joi.object({
        JWT_SECRET_ACCESS: Joi.string(),
        JWT_EXPIRE_TIME_ACCESS: Joi.string(),
        JWT_SECRET_REFRESH: Joi.string(),
        JWT_EXPIRE_TIME_REFRESH: Joi.string(),
      }),
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtConfigModule {}
