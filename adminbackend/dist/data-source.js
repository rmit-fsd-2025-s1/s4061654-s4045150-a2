"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Profile_1 = require("./entity/Profile");
const Pet_1 = require("./entity/Pet");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    /* Change to your own credentials */
    username: "matt",
    password: "matt",
    database: "matt",
    // synchronize: true will automatically create database tables based on entity definitions
    // and update them when entity definitions change. This is useful during development
    // but should be disabled in production to prevent accidental data loss.
    synchronize: true,
    logging: true,
    entities: [Profile_1.Profile, Pet_1.Pet],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map