import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Courses } from "./Courses";
import { UserInformation } from "./UserInformation";

// AFTER: explicitly tell TypeORM “this property maps to column lecturer_id”
@Entity("lecturer_courses")
export class LecturerCourses {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column({ name: "lecturer_id" })
  lecturerId: number;      // now it reads from column “lecturer_id”

  @Column({ name: "course_id" })
  courseId: number;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturer_id" })
  lecturer: UserInformation;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: "course_id" })
  course: Courses;
}
