import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './configs/app/config.service';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<number> {
  const app = await NestFactory.create(AppModule);
  
  const appConfig: AppConfigService = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  console.log(`Server/App prepares run on ...`)
  await app.listen(appConfig.port);
  return appConfig.port;
}
bootstrap()
.then((port) => {
  console.log("Server/App is running on port " + port)
})
.catch(() => new Error("Something fail loading the server/app"))

