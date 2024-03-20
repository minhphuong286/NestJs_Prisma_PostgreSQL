import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secretAccess: process.env.JWT_SECRET_ACCESS,
  expireTimeAccess: process.env.JWT_EXPIRE_TIME_ACCESS,
  secretRefresh: process.env.JWT_SECRET_REFRESH,
  expireTimeRefresh: process.env.JWT_EXPIRE_TIME_REFRESH
}));