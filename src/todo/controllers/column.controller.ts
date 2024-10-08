import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnService } from '../services/column.service';
import { CreateColumnDto } from '../dto/create-todo.dto';
import { UpdateColumnDto } from '../dto/update-todo.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  async create(@Body() createTodoDto: CreateColumnDto) {
    try {
      const todo = await this.columnService.createColumn(createTodoDto);

      return {
        success: true,
        message: 'Column created!',
        todo,
      }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.update(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnService.remove(+id);
  }
}