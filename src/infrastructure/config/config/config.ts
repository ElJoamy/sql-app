import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
};

export const dbConfig = {
    db_host: process.env.DB_HOST || 'localhost',
    db_port: (process.env.DB_PORT || 3306) as number,
    db_user: process.env.DB_USER || 'root',
    db_pass: process.env.DB_PASS || 'root',
    db_name: process.env.DB_NAME || 'test',
    db_type: (process.env.DB_TYPE || 'mysql') as any,
}

export const loggerConfig = {
    logger_level: process.env.LOGGER_LEVEL || 'info',
    node_env: process.env.NODE_ENV
}