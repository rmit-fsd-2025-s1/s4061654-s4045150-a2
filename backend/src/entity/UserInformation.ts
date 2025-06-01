import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { Applications } from "./Applications";
import { ApplicantCourses } from "./ApplicantCourses";

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

  @CreateDateColumn()
  createdAt: Date;

  //FK to Applications
  @OneToMany(() => Applications, (app) => app.applicant)
  applications: Applications[];

  @OneToMany(() => ApplicantCourses, (app) => app.applicant)
  applicantCourses: ApplicantCourses[];
}
