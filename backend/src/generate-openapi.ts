import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  try {
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('CS Toolboxes API')
      .setDescription('API contract for the CSMJU Computer Science toolboxes subsystem')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const outputPath = resolve(__dirname, '../openapi.json');

    await writeFile(
      outputPath,
      `${JSON.stringify(document, null, 2)}\n`,
      'utf8',
    );
  } finally {
    await app.close();
  }
}

generateOpenApi().catch(() => {
  process.stderr.write('Failed to generate OpenAPI document.\n');
  process.exitCode = 1;
});
