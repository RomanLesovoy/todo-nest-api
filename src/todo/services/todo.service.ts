import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo as TodoEntity } from '../entities/todo.entity';
import { Room as RoomEntity } from '../entities/room.entity';
import { Column as ColumnEntity } from '../entities/column.entity';
import { RoomGateway } from '../room.gateway';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
    private readonly roomGateway: RoomGateway,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const room = await this.roomRepository.findOneBy({ hash: createTodoDto.roomHash });
    const column = await this.columnRepository.findOneBy({ id: createTodoDto.columnId });

    if (!room) {
      throw new Error('Room not exists');
    }
    if (!column) {
      throw new Error('Column not exists');
    }

    const todo = await this.todoRepository.create({
      columnId: column.id,
      isCompleted: false,
      roomId: room.id,
      title: createTodoDto.title,
    });
    const saved = await this.todoRepository.save(todo);
    
    this.wsTodo({ ...saved, room }, 'create');
    return saved;
  }

  async findAllTodos(): Promise<TodoEntity[]> {
    const todos = await this.todoRepository.find();
    return todos;
  }

  private findOneWithRoom(id: number) {
    return this.todoRepository.findOne({ where: { id }, relations: { room: true } })
  }

  async findOne(id: number): Promise<TodoEntity | null> {
    const todo = await this.findOneWithRoom(id);
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOneWithRoom(id);
    const result = await this.todoRepository.save({ ...todo, ...updateTodoDto });
    this.wsTodo(result, 'update');
    return result;
  }

  async remove(id: number) {
    const todo = await this.findOneWithRoom(id);
    this.wsTodo(todo, 'delete');
    await this.todoRepository.remove(todo);
  }

  wsTodo(todo: TodoEntity, action: 'create' | 'delete' | 'update') {
    const roomHash = todo.room.hash;
    this.roomGateway.server.to(roomHash).emit('roomUpdate', {
      action,
      type: 'todo',
      value: todo,
      roomHash,
    });
  }
}
