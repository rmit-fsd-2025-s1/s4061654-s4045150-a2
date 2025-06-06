import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { Applications } from "./Applications";
import { LecturerCourses } from "./LecturerCourses";

@Entity()
export class UserInformation {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  about: string;

  @Column()
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Applications, (app) => app.applicant)
  applications: Applications[];

  @OneToMany(
    () => LecturerCourses,
    (lecturerCourse) => lecturerCourse.lecturer
  )
  lecturerCourses: LecturerCourses[];
}
