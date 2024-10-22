import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto, CreateColumnDto, CreateRoomDto } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({
    description: 'The title of the todo',
    example: 'Buy milk',
  })
  title?: string;

  @ApiProperty({
    description: 'The completion status of the todo',
    example: false,
  })
  isCompleted?: boolean;
}

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @ApiProperty({
    description: 'The name of the column',
    example: 'To Do',
  })
  name?: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiProperty({
    description: 'The name of the room',
    example: 'Project 1',
  })
  name?: string;
}
