import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Courses } from "./Courses";
import { UserInformation } from "./UserInformation";

@Entity()
export class LecturerCourses {
  @PrimaryGeneratedColumn()
  rowId: number;

  @ManyToOne(() => UserInformation, (user) => user.lecturerCourses)
  lecturer: UserInformation;

  @ManyToOne(() => Courses, (course) => course.lecturerCourses)
  course: Courses;
}
