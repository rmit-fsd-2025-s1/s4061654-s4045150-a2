import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ApplicationCourses } from "./ApplicationCourses";
import { LecturerCourses } from "./LecturerCourses";

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

  @OneToMany(() => LecturerCourses, (lecturerCourse) => lecturerCourse.course)
  lecturerCourses: LecturerCourses[];
}
