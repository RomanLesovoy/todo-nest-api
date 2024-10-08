import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room as RoomEntity } from '../entities/room.entity';
import { UpdateRoomDto } from '../dto/update-todo.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async findByRoom(hash: string) {
    const todos = await this.roomRepository.find({
      where: {
        hash
      },
      relations: {
        todos: true,
        columns: true,
      }
    });
    return todos;
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    const room = await this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async remove(id: number) {
    const todo = await this.roomRepository.findOneBy({ id });
    await this.roomRepository.remove(todo);
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const todo = await this.roomRepository.findOneBy({ id });
    return await this.roomRepository.save({ ...todo, ...updateRoomDto })
  }
}
