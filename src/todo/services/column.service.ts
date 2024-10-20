import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateColumnDto } from '../dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Column as ColumnEntity } from '../entities/column.entity';
import { Room as RoomEntity } from '../entities/room.entity';
import { UpdateColumnDto } from '../dto/update-todo.dto';
import { from, map, tap, Observable, of, switchMap, throwError } from 'rxjs';
import { RoomGateway } from '../room.gateway';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
    private readonly roomGateway: RoomGateway,
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
    this.wsColumn(column, 'add');
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
        tap((column) => this.wsColumn(column, 'add')),
        map((v: ColumnEntity) => v)
      )
  }

  remove(id: number): Observable<ColumnEntity> {
    return from(this.columnRepository.findOneBy({ id })).pipe(
      switchMap((col) => from(this.columnRepository.remove(col))),
      tap((column) => this.wsColumn(column, 'remove')),
      map((v: ColumnEntity) => v)
    )
  }

  update(id: number, updateColumnDto: UpdateColumnDto): Observable<ColumnEntity> {
    return from(this.columnRepository.findOneBy({ id })).pipe(
      switchMap((col) => from(this.columnRepository.save({ ...col, ...updateColumnDto }))),
      tap((column) => this.wsColumn(column, 'update')),
      map((v: ColumnEntity) => v)
    )
  }

  wsColumn(column: ColumnEntity, action: 'add' | 'remove' | 'update') {
    const roomHash = column.room.hash;
    this.roomGateway.server.to(roomHash).emit('roomUpdate', {
      action,
      type: 'column',
      value: column,
      roomHash,
    });
  }
}
