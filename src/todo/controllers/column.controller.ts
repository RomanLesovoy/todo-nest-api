import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnService } from '../services/column.service';
import { CreateColumnDto } from '../dto/create-todo.dto';
import { UpdateColumnDto } from '../dto/update-todo.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  async create(@Body() createTodoDto: CreateColumnDto) {
    return new Promise((res, rej) => {
      this.columnService.createColumn$(createTodoDto).subscribe({
        next: (column) => res({
          success: true,
          message: 'Column created!',
          column: column,
        }),
        error: (e) => rej({
          success: false,
          message: e.message,
          status: 500,
        }),
      })
    })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return new Promise((res, rej) => {
      this.columnService.update(+id, updateColumnDto).subscribe({
        next: (col) => res({
          success: true,
          message: 'Column updated!',
          column: col,
        }),
        error: (e) => rej({
          success: false,
          message: e.message,
          status: 500,
        })
      })
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return new Promise((res, rej) => {
      this.columnService.remove(+id).subscribe({
        next: () => res({
          success: true,
          message: 'Column deleted!',
        }),
        error: (e) => rej({
          success: false,
          message: e.message,
          status: 500,
        })
      })
    });
  }
}
