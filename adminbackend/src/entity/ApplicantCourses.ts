import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserInformation } from "./UserInformation";
import { Courses } from "./Courses";
import { Applications } from "./Applications";

@Entity()
export class ApplicantCourses {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserInformation, (user) => user.applicantCourses)
  applicant: UserInformation;

  @ManyToOne(() => Courses, (course) => course.applicantCourses)
  course: Courses;

  @ManyToOne(() => Applications, (app) => app.applicantCourses)
  application: Applications;
}
