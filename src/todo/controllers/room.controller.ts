import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { CreateRoomDto } from '../dto/create-todo.dto';
import { UpdateRoomDto } from '../dto/update-todo.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get(':hash')
  findbyRoom(@Param('hash') hash: string) {
    return this.roomService.findByRoom(hash);
  }

  @Post()
  async create(@Body() createTodoDto: CreateRoomDto) {
    try {
      const todo = await this.roomService.createRoom(createTodoDto);

      return {
        success: true,
        message: 'Room created!',
        todo,
      }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomService.update(+id, updateRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomService.remove(+id);
  // }
}