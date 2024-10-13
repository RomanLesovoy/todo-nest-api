import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room as RoomEntity } from '../entities/room.entity';
import { UpdateRoomDto } from '../dto/update-todo.dto';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async findByRoom(hash: string) {
    const todo = await this.roomRepository.findOneOrFail({
      where: {
        hash,
      },
      relations: {
        columns: true,
        todos: true,
      }
    });
    return todo;
  }

  createRoom(createRoomDto: CreateRoomDto): Observable<RoomEntity> {
    const roomHash = (Math.random() + 1).toString(36).substring(2);

    return of(this.roomRepository.create({ ...createRoomDto, hash: roomHash }))
      .pipe(
        switchMap((v) => from(this.roomRepository.save(v))),
        map(v => v)
      )
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
