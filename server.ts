import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/api/app.module';
import next from 'next';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const dev = process.env.NODE_ENV !== 'production';
  const nextApp = next({ dev, dir: '.' });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.init();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  await server.listen(3000, '0.0.0.0');
  console.log('> Ready on http://localhost:3000');
}
bootstrap();
