import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'todo'
})
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  title: string;

  @Column({ default: false })
  isCompleted: boolean;
}

