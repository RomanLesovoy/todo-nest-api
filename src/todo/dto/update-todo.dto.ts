import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto, CreateColumnDto, CreateRoomDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  title?: string;
  isCompleted?: boolean;
}

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  name?: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  name?: string;
}
