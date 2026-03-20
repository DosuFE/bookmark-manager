import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Enable CORS (allow frontend)
  app.enableCors({
    origin: '*', 
  });

  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(`Server running on port ${port}`);
}

bootstrap();