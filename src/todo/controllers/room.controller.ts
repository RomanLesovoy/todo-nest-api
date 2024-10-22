import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiBody } from '@nestjs/swagger';
import { RoomService } from '../services/room.service';
import { CreateRoomDto } from '../dto/create-todo.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Get a room by hash' })
  @ApiResponse({ status: 200, description: 'Room found successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get(':hash')
  async findbyRoom(@Param('hash') hash: string) {
    try {
      const room = await this.roomService.findByRoom(hash);
      return {
        success: true,
        room,
      };
    } catch (e) {
      return {
        success: false,
        status: 500,
        message: e.message,
      }
    }
  }

  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 200, description: 'Room created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: CreateRoomDto })
  @Post()
  async create(@Body() createTodoDto: CreateRoomDto) {
    return new Promise((res, rej) => {
      this.roomService.createRoom(createTodoDto).subscribe({
        next: (r) => {
          res({
            success: true,
            message: 'Room created!',
            roomHash: r.hash,
          })
        },
        error: (e) => {
          rej({
            success: false,
            status: 500,
            message: e.message,
          })
        }
      })
    })
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