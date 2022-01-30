import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  console.log('process.env.PORT', process.env.PORT);
  const server = await app.listen(process.env.PORT || 3001);
  server.setTimeout(1800000); // 600,000=> 10Min, 1200,000=>20Min, 1800,000=>30Min
}
bootstrap();
