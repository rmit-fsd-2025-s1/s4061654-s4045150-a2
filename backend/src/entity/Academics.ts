import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Applications } from "./Applications";

@Entity()
export class Academics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  degree: string;

  @Column()
  year: number;

  @Column()
  university: string;

  @ManyToOne(() => Applications, (app) => app.academics)
  application: Applications;
}
