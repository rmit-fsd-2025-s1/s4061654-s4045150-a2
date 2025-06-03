import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Applications } from "./Applications";
import { UserInformation } from "./UserInformation";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => Applications)
  @JoinColumn({ name: "applicationId" })
  application: Applications;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "lecturerId" })
  lecturer: UserInformation;
}
