import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ApplicationCourses } from "./ApplicationCourses";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  courseID: number;

  @Column()
  courseName: string;

  @OneToMany(
    () => ApplicationCourses,
    (applicationCourse) => applicationCourse.course
  )
  applicantCourses: ApplicationCourses[];
}
