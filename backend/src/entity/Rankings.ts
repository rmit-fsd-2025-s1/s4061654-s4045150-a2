import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Rankings {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column()
  lecturerId: number;

  @Column({ nullable: true })
  firstChoiceId: number;

  @Column({ nullable: true })
  secondChoiceId: number;

  @Column({ nullable: true })
  thirdChoiceId: number;
}
