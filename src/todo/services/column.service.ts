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

  private _findOneWithRoom(id: number) {
    return this.columnRepository.findOne({ where: { id }, relations: { room: true } })
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
        switchMap((column) => this.columnRepository.save(column)),
        switchMap((column) => from(this._findOneWithRoom(column.id))),
        tap((column) => this.wsColumn(column, 'create')),
        map((v: ColumnEntity) => v)
      )
  }

  remove(id: number): Observable<ColumnEntity> {
    return from(this._findOneWithRoom(id)).pipe(
      tap((col) => this.columnRepository.remove(col)),
      tap((column) => this.wsColumn(column, 'delete')),
      map((v: ColumnEntity) => v)
    )
  }

  update(id: number, updateColumnDto: UpdateColumnDto): Observable<ColumnEntity> {
    return from(this._findOneWithRoom(id)).pipe(
      switchMap((col) => from(this.columnRepository.save({ ...col, ...updateColumnDto }))),
      tap((column) => this.wsColumn(column, 'update')),
      map((v: ColumnEntity) => v)
    )
  }

  wsColumn(column: ColumnEntity, action: 'create' | 'delete' | 'update') {
    const roomHash = column.room.hash;
    this.roomGateway.server.to(roomHash).emit('roomUpdate', {
      action,
      type: 'column',
      value: column,
      roomHash,
    });
  }
}
