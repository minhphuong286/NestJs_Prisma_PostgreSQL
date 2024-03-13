import { existsSync } from 'fs';
import { resolve } from 'path';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export function getEnvironmentPath(dest: string): string {
  const filePath: string = resolve(`${dest}/.env`);
  if (!existsSync(filePath)) {
    console.log("Not found dest file: ", `${dest}/.env`);
  }
  return filePath;
}

//In future
export function getEnvironmentPathV2(dest: string): string {
  const env: string | undefined = process.env.APP_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}
