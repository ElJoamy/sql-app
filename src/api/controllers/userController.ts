import { Request, Response, Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserDto } from '../../app/dtos/user.dto';
import { CreateUserDTO } from '../../app/dtos/create.user.dto';
import logger from '../../infrastructure/logger/logger';

export class UserController {
    public router: Router;
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.router = Router();
        this.routes();
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        logger.info("Estoy dentro del getUserById Controller"); // Registro de información
        logger.debug("Esto es un debug"); // Registro de depuración

        const { id } = req.params;
        const userDto = await this.userService.getUserById(id);

        if (!userDto) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(userDto);
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userDto: CreateUserDTO = req.body;
            logger.info("Creando un nuevo usuario"); // Registro de información
            const user = await this.userService.createUser(userDto);
            logger.debug("Usuario creado con éxito"); // Registro de depuración
            return res.status(201).json(user);
        } catch (error) {
            logger.error("Error al crear el usuario: " + error); // Registro de error
            return res.status(400).json({ message: error });
        }
    }

    public routes() {
        this.router.get('/:id', this.getUserById.bind(this));
        this.router.post('/', this.createUser.bind(this));
    }
}
