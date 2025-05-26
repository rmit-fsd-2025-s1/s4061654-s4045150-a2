import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Courses } from "./Courses";
import { UserInformation } from "./UserInformation";

@Entity()
export class Lecturers {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column()
  lecturerId: number;

  @Column()
  courseId: number;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturerId" })
  lecturer: UserInformation;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: "courseId" })
  course: Courses;
  
}
