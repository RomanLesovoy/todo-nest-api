import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import * as ormConfig from '../ormconfig.json';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...ormConfig,
  } as any), TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
