import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The title of the todo',
    example: 'Buy milk',
  })
  title: string;

  @IsBoolean()
  @ApiProperty({
    description: 'The completion status of the todo',
    example: false,
  })
  isCompleted?: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The hash of the room',
    example: '1234567890',
  })
  roomHash: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the column',
    example: 1,
  })
  columnId: number;
}

export class CreateColumnDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the column',
    example: 'To Do',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The hash of the room',
    example: '1234567890',
  })
  roomHash: string;
}

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the room',
    example: 'Project 1',
  })
  name: string;
}
