import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { RequestMethod } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function generateOpenApi(): Promise<void> {
  // OpenAPI generation only inspects route metadata; it must not require a
  // database connection or initialize Prisma lifecycle hooks.
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({})
    .compile();
  const app = moduleRef.createNestApplication({ logger: false });

  try {
    await app.init();

    app.setGlobalPrefix('api', {
      exclude: [
        { path: 'auth/login', method: RequestMethod.GET },
        { path: 'auth/callback', method: RequestMethod.GET },
        { path: 'auth/logout', method: RequestMethod.POST },
      ],
    });

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
