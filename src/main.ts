import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');

  const whitelist = ['https://tickets-board-v1.firebaseapp.com', 'http://tickets-board-v1.firebaseapp.com/'];
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log("Allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("Blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders:"*",
  });

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer')
    }
  ));

  const isDevelopment = process.env.NODE_ENV === 'development';

  await app.listen(isDevelopment ? 3000 : 10000);
}
bootstrap();
