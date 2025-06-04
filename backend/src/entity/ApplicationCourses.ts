import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Courses } from "./Courses";
import { Applications } from "./Applications";

@Entity()
export class ApplicationCourses {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Courses, (course) => course.applicantCourses)
  course: Courses;

  @ManyToOne(() => Applications, (app) => app.applicantCourses)
  application: Applications;
}
