import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateColumnDto, CreateRoomDto, CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    try {
      const todo = await this.todoService.create(createTodoDto);

      return {
        success: true,
        message: 'Task created!',
        todo,
      }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  @Get()
  findAll() {
    return this.todoService.findAllTodos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
