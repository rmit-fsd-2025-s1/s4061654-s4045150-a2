import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

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
}
