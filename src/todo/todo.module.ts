import { Module } from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { ColumnService } from './services/column.service';
import { RoomService } from './services/room.service';
import { TodoController } from './controllers/todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo as TodoEntity } from './entities/todo.entity';
import { Room as RoomEntity } from './entities/room.entity';
import { Column as ColumnEntity } from './entities/column.entity';
import { RoomController } from './controllers/room.controller';
import { ColumnController } from './controllers/column.controller';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [TypeOrmModule.forFeature(
    [RoomEntity, TodoEntity, ColumnEntity]
  )],
  controllers: [TodoController, RoomController, ColumnController],
  providers: [TodoService, ColumnService, RoomService, RoomGateway],
})
export class TodoModule {}
