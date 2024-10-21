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
        callback(null, true)
      } else {
        console.error("Blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders:"*",
  });

  const ioAdapter = new IoAdapter(app);

  const socketIoOptions = {
    cors: true,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
    serveClient: false,
    allowEIO3: true,
    allowUpgrades: true,
    httpCompression: true,
  };
  (app.getHttpAdapter().getInstance() as any).options = socketIoOptions;
  app.useWebSocketAdapter(ioAdapter);

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
