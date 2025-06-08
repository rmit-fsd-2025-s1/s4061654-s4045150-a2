import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from "typeorm";
import { Applications } from "./Applications";
import { UserInformation } from "./UserInformation";

@Entity()
@Unique(["lecturerId", "rank"])
@Unique(["lecturerId", "applicationId"])
export class Rankings {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column()
  lecturerId: number;

  @Column()
  applicationId: number;

  @Column()
  rank: number; // 1, 2, or 3

  @ManyToOne(() => Applications)
  @JoinColumn({ name: "applicationId" })
  application: Applications;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturerId" })
  lecturer: UserInformation;
}
