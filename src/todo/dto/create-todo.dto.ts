import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
} from '@nestjs/class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsBoolean()
  isCompleted?: boolean;

  @IsNotEmpty()
  @IsString()
  roomHash: string;

  @IsNotEmpty()
  @IsNumber()
  columnId: number;
}

export class CreateColumnDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  roomHash: string;
}

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  hash: string;
}
