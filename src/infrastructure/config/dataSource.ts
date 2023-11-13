import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../entities/userEntity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "192.168.80.130",
    port: 3306,
    username: "Joseph",
    password: "Joseph135*",
    database: "JosephDB",
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    subscribers: [],
    migrations: [],
});
