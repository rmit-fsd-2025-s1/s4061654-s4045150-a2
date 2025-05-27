import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entity/Profile";
import { Pet } from "./entity/Pet";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3006,
  /* Change to your own credentials */
  username: "S4061654",
  password: "Password4231",
  database: "S4061654",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [Profile, Pet],
  migrations: [],
  subscribers: [],
});
