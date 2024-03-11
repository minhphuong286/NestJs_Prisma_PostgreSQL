import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './configs/app/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  
  const appConfig: AppConfigService = app.get(AppConfigService);

  await app.listen(appConfig.port);
}
bootstrap()
.then(() => {
  console.log("Server/App is running")
})
.catch(() => new Error("Something fail loading the server/app"))

