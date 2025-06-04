import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { Applications } from "./Applications";

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
}
