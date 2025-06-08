import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import { UserInformation } from "./entity/UserInformation";
import { Applications } from "./entity/Applications";
import { Courses } from "./entity/Courses";
import { ApplicationCourses } from "./entity/ApplicationCourses";
import { LecturerCourses } from "./entity/LecturerCourses";
import { Selections } from "./entity/Selections";
import { Rankings } from "./entity/Rankings";
import { Comments } from "./entity/Comments";
import { Experience } from "./entity/Experience";
import { Academics } from "./entity/Academics";

export const AppDataSource = new DataSource({
  type: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    UserInformation,
    Applications,
    Courses,
    ApplicationCourses,
    LecturerCourses,
    Selections,
    Rankings,
    Comments,
    Experience,
    Academics,
  ],
  migrations: [],
  subscribers: [],
});
//DataSource initialization for unit testing
export const coursesRepository = AppDataSource.getRepository(Courses);
export const userInformationRepository =
  AppDataSource.getRepository(UserInformation);
export const applicationsRepository = AppDataSource.getRepository(Applications);
export const applicationCoursesRepository =
  AppDataSource.getRepository(ApplicationCourses);
export const lecturerCoursesRepository =
  AppDataSource.getRepository(LecturerCourses);
export const selectionsRepository = AppDataSource.getRepository(Selections);
export const rankingsRepository = AppDataSource.getRepository(Rankings);
