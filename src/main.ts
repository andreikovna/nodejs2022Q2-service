import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const api = await readFile(join(dirname(__dirname), 'doc', 'api.yaml'), 'utf-8');
  const doc = parse(api);
  SwaggerModule.setup('doc', app, doc);

  await app.listen(port);
}
bootstrap();
