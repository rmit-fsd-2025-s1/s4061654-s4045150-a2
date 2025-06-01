import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { UserInformation } from "./UserInformation";
import { experience } from "../types/experience";
import { qualification } from "../types/qualification";
import { ApplicantCourses } from "./ApplicantCourses";

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

  @OneToMany(() => ApplicantCourses, (ac) => ac.applicationID)
  applicantCourses: ApplicantCourses[];

  @Column("simple-json", { nullable: true })
  experience: experience[];

  @Column("simple-array", { nullable: true })
  skills: string[];

  @Column("simple-json", { nullable: true })
  academics: qualification[];
}
