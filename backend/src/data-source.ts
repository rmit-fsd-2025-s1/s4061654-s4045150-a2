import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserInformation } from "./entity/UserInformation";
import { Applications } from "./entity/Applications";
import { Courses } from "./entity/Courses";
import { ApplicantCourses } from "./entity/ApplicantCourses";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4061654",
  password: "Password4231",
  database: "S4061654",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [UserInformation, Applications, Courses, ApplicantCourses],
  migrations: [],
  subscribers: [],
});
