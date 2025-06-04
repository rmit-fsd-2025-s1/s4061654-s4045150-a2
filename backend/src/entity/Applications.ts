import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { UserInformation } from "./UserInformation";
import { Experience } from "./Experience";
import { Academics } from "./Academics";
import { ApplicantCourses } from "./ApplicantionCourses";

@Entity()
export class Applications {
  @PrimaryGeneratedColumn()
  applicationID: number;

  @ManyToOne(() => UserInformation, (user) => user.applications)
  applicant: UserInformation;

  @Column()
  availability: string;

  @Column()
  position: string;

  @Column("simple-array")
  skills: string[];

  @OneToMany(() => ApplicantCourses, (ac) => ac.application)
  applicantCourses: ApplicantCourses[];

  @OneToMany(() => Experience, (exp) => exp.application)
  experiences: Experience[];

  @OneToMany(() => Academics, (ac) => ac.application)
  academics: Academics[];
}
