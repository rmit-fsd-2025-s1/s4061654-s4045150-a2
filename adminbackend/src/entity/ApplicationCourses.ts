import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Courses } from "./Courses";
import { Applications } from "./Applications";

@Entity({ name: "application_courses" })
export class ApplicationCourses {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Courses, (course) => course.applicantCourses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "courseID" })
  course: Courses;

  @ManyToOne(() => Applications, (app) => app.applicantCourses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "applicationID" })
  application: Applications;
}
