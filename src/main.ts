import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');
  
  const isDevelopment = process.env.NODE_ENV === 'development';

  const whitelist = isDevelopment ? ['http://localhost:4200'] : ['https://tickets-board-v1.firebaseapp.com'];

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.error("Blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Custom-Header'],
    credentials: true,
    maxAge: 600,
  });

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Tickets Board API')
    .setDescription('API for the Tickets Board application')
    .setVersion('1.0')
    .build(); 

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api/v1/docs', app, document);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer')
    }
  ));

  await app.listen(process.env.PORT);
}
bootstrap();
