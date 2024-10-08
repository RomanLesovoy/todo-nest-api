import { Column, Entity, Index, ManyToOne, JoinTable, PrimaryGeneratedColumn, PrimaryColumn, JoinColumn } from "typeorm";
import { Column as ColumnEntity } from './column.entity';
import { Room } from "./room.entity";

@Entity({
  name: 'todos'
})
@Index(['columnId', 'roomId'])
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  title: string;

  @Column({ default: false })
  isCompleted: boolean;

  @PrimaryColumn()
  columnId: number;

  @ManyToOne(() => ColumnEntity, (column) => column.todos)
  // @JoinColumn({ name: 'columnId' })
  column: ColumnEntity;

  @PrimaryColumn()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.todos)
  // @JoinColumn({ name: 'roomId' })
  room: Room;
}
