import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../entities/userEntity";
import { dbConfig } from "./config/config";

export const AppDataSource = new DataSource({
    type: dbConfig.db_type,
    host: dbConfig.db_host,
    port: dbConfig.db_port,
    username: dbConfig.db_user,
    password: dbConfig.db_pass,
    database: dbConfig.db_name,
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    subscribers: [],
    migrations: [],
});
