import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Applications } from "./Applications";

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @Column()
  company: string;

  @Column()
  description: string;

  @ManyToOne(() => Applications, (app) => app.experiences)
  application: Applications;
}