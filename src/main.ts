import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');
  
  const isDevelopment = process.env.NODE_ENV === 'development';

  const whitelist = isDevelopment ? ['http://localhost:4200'] : ['https://tickets-board-v1.firebaseapp.com', 'http://tickets-board-v1.firebaseapp.com/'];

  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        // console.log("Allowed cors for:", origin)
        callback(null, true)
      } else {
        console.error("Blocked cors for:", origin)
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

  // app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(process.env.PORT);
}
bootstrap();
