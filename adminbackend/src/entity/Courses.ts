import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ApplicantCourses } from "./ApplicantCourses";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  courseID: number;

  @Column()
  courseName: string;

  @OneToMany(
    () => ApplicantCourses,
    (applicantCourse) => applicantCourse.course
  )
  applicantCourses: ApplicantCourses[];
}
