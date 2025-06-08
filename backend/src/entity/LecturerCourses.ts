import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Courses } from "./Courses";
import { UserInformation } from "./UserInformation";

@Entity("lecturer_courses")
export class LecturerCourses {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column({ name: "lecturer_id" })
  lecturerId: number;

  @Column({ name: "course_id" })
  courseId: number;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturer_id" })
  lecturer: UserInformation;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: "course_id" })
  course: Courses;
}
