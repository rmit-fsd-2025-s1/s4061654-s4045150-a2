import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { UserInformation } from "./UserInformation";
import { Courses } from "./Courses";
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

  @ManyToOne(() => Applications, (app) => app.applicantCourses)
  application: Applications;
}
