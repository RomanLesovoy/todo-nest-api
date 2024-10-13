import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.enableCors({
    allowedHeaders:"*",
    origin: true
  });

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer')
    }
  ));
  await app.listen(3000);
}
bootstrap();
