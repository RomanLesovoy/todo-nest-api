import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiBody } from '@nestjs/swagger';
import { ColumnService } from '../services/column.service';
import { CreateColumnDto } from '../dto/create-todo.dto';
import { UpdateColumnDto } from '../dto/update-todo.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new column' })
  @ApiResponse({ status: 200, description: 'Column created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: CreateColumnDto })
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
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({ status: 200, description: 'Column updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: UpdateColumnDto })
  async update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
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
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({ status: 200, description: 'Column deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async remove(@Param('id') id: string) {
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
