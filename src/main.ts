import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const api = await readFile(join(dirname(__dirname), 'doc', 'api.yaml'), 'utf-8');
  const doc = parse(api);
  SwaggerModule.setup('doc', app, doc);

  await app.listen(port);
}
bootstrap();
