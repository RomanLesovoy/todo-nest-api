import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from "typeorm";
import { Todo } from "./todo.entity";
import { Column as ColumnEntity } from './column.entity';

@Entity({
  name: 'rooms'
})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  name: string;

  @OneToMany(() => Todo, (todo) => todo.room, { cascade: true, nullable: true, })
  todos: Todo[];

  @OneToMany(() => ColumnEntity, (column) => column.room, { cascade: true, nullable: true, })
  columns: ColumnEntity[];
}
