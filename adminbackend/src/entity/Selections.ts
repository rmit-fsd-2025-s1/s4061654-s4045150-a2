import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Applications } from "./Applications";
import { UserInformation } from "./UserInformation";

@Entity()
export class Selections {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column()
  lecturerId: number;

  @Column()
  applicationId: number;

  @ManyToOne(() => Applications)
  @JoinColumn({ name: "applicationId" })
  application: Applications;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturerId" })
  lecturer: UserInformation;
}
