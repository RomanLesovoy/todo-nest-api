import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateColumnDto } from '../dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Column as ColumnEntity } from '../entities/column.entity';
import { Room as RoomEntity } from '../entities/room.entity';
import { UpdateColumnDto } from '../dto/update-todo.dto';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';

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
    return from(this.roomRepository.findOneBy({ hash: createColumnDto.roomHash }))
      .pipe(
        switchMap((room) => room ? of(
          this.columnRepository.create({
            name: createColumnDto.name,
            roomId: room.id,
          }),
        ) : throwError(() => new Error('room not exists'))),
        switchMap((column) => from(this.columnRepository.save(column))),
        map((v: ColumnEntity) => v)
      )
  }

  remove(id: number): Observable<ColumnEntity> {
    return from(this.columnRepository.findOneBy({ id })).pipe(
      switchMap((col) => from(this.columnRepository.remove(col))),
      map((v: ColumnEntity) => v)
    )
  }

  update(id: number, updateColumnDto: UpdateColumnDto): Observable<ColumnEntity> {
    return from(this.columnRepository.findOneBy({ id })).pipe(
      switchMap((col) => from(this.columnRepository.save({ ...col, ...updateColumnDto }))),
      map((v: ColumnEntity) => v)
    )
  }
}
