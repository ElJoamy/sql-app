import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../entities/user.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "192.168.232.210",
    port: 3306,
    username: "root",
    password: "root",
    database: "certi",
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    subscribers: [],
    migrations: [],
});