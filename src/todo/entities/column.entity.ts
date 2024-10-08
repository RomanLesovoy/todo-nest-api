import { PrimaryGeneratedColumn, PrimaryColumn, Entity, Index, JoinColumn, ManyToOne, Column as ColumnType, OneToMany } from "typeorm";
import { Room } from "./room.entity";
import { Todo } from "./todo.entity";

@Entity({
  name: 'columns'
})
@Index(['roomId'])
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnType()
  name: string;

  @PrimaryColumn()
  roomId: number;
  @ManyToOne(() => Room, (room) => room.columns)
  // @JoinColumn({ name: 'roomId' })
  room: Room;

  @OneToMany(() => Todo, (todo) => todo.column, { cascade: true, nullable: true, })
  todos: Todo[];
}
