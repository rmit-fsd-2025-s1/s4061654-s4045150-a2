import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserInformation } from "./UserInformation";
import { experience } from "../types/experience";
import { qualification } from "../types/qualification";

@Entity()
export class Applications {
  @PrimaryGeneratedColumn()
  applicationID: number;

  @ManyToOne(() => UserInformation, (user) => user.applications)
  applicant: UserInformation;

  @Column({ nullable: true })
  availability: string;

  @Column("simple-json", { nullable: true })
  experience: experience[];

  @Column("simple-json", { nullable: true })
  skills: string[];

  @Column("simple-json", { nullable: true })
  academics: qualification[];
}
