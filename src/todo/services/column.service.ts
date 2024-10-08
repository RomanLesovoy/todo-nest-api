import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateColumnDto } from '../dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Column as ColumnEntity } from '../entities/column.entity';
import { Room as RoomEntity } from '../entities/room.entity';
import { UpdateColumnDto } from '../dto/update-todo.dto';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async createColumn(createColumnDto: CreateColumnDto): Promise<ColumnEntity | Error> {
    const room = await this.roomRepository.findOneBy({ hash: createColumnDto.roomHash });

    if (!room) {
      throw new Error('room not exists');
    }

    const column = await this.columnRepository.create({
      name: createColumnDto.name,
      roomId: room.id,
    });
    return this.columnRepository.save(column);
  }

  createColumn$(createColumnDto: CreateColumnDto): Observable<ColumnEntity | Error> {
    return from(this.roomRepository.findOneByOrFail({ hash: createColumnDto.roomHash }))
      .pipe(
        switchMap((room) => of(
          this.columnRepository.create({
            name: createColumnDto.name,
            roomId: room.id,
          }),
        )),
        switchMap((column) => from(this.columnRepository.save(column))),
        map((v: ColumnEntity) => v)
      )
  }

  async remove(id: number) {
    const todo = await this.columnRepository.findOneBy({ id });
    await this.columnRepository.remove(todo);
  }

  async update(id: number, updateColumnDto: UpdateColumnDto) {
    const todo = await this.columnRepository.findOneBy({ id });
    return await this.columnRepository.save({ ...todo, ...updateColumnDto })
  }
}
