import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from "morgan";
import { AppDataSource } from "./infrastructure/config/dataSource";
import { UserService } from './app/services/userService';
import { UserRepositoryImpl } from './infrastructure/repositories/userRepositoryImpl';
import { UserController } from './api/controllers/userController';
import { config } from './infrastructure/config/config/config';
import logger from './infrastructure/logger/logger';

AppDataSource.initialize().then(() => {
    const app = express();

    const PORT = config.port;
    app.use(express.json());

    app.use(
        morgan("combined", {
          stream: { write: (message: string) => logger.info(message.trim()) },
        })
      );

    app.get('/', (req: Request, res: Response) => {
        res.send('Servidor Up');
    });

    const userRepository = new UserRepositoryImpl();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.use('/users', userController.router);

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
