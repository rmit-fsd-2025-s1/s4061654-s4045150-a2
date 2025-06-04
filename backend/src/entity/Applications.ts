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
import { ApplicationCourses } from "./ApplicationCourses";

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

  @OneToMany(() => ApplicationCourses, (ac) => ac.application)
  applicantCourses: ApplicationCourses[];

  @OneToMany(() => Experience, (exp) => exp.application)
  experiences: Experience[];

  @OneToMany(() => Academics, (ac) => ac.application)
  academics: Academics[];
}
