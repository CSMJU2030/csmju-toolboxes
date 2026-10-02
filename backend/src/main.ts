// backend/src/main.ts

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ExceptionFilter } from './common/exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { AppValidationPipe } from './common/validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new AppValidationPipe());
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();