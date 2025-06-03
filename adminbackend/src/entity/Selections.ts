import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { UserInformation } from "./UserInformation";

@Entity()
export class Selections {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column()
  lecturerId: number;

  @Column()
  applicantId: number;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturerId" })
  lecturer: UserInformation;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "applicantId" })
  applicant: UserInformation;
}
