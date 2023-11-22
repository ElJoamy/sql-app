import { Request, Response, Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserDto } from '../../app/dtos/user.dto';
import { CreateUserDTO } from '../../app/dtos/create.user.dto';
import logger from '../../infrastructure/logger/logger';
import { verifyTokenMiddleware } from './../middleware/verifyToken';

export class UserController {
    public router: Router;
    private userService: UserService;


    constructor(userService: UserService) {
        this.userService = userService;
        this.router = Router();
        this.routes();
    }

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Obtiene una lista de todos los usuarios
     *     tags: [Usuarios]
     *     responses:
     *       200:
     *         description: Lista de usuarios obtenida con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: El ID único del usuario
     *                   username:
     *                     type: string
     *                     description: El nombre de usuario
     *                   email:
     *                     type: string
     *                     description: La dirección de correo electrónico del usuario
     *                   lastLogin:
     *                     type: string
     *                     format: date-time
     *                     nullable: true
     *                     description: La fecha y hora del último inicio de sesión del usuario
     *                   token:
     *                     type: string
     *                     nullable: true
     *                     description: El token de autenticación del usuario (si está disponible)
     *       400:
     *         description: Error en la solicitud
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: No autorizado para acceder a este recurso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */

    public async getUsers(req: Request, res: Response): Promise<void> {
        const users: UserDto[] = await this.userService.getUsers();
        res.json(users);
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Obtiene los detalles de un usuario específico por su ID
     *     tags: [Usuarios]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: El ID único del usuario
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Detalles del usuario obtenidos con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: El ID único del usuario
     *                 username:
     *                   type: string
     *                   description: El nombre de usuario
     *                 email:
     *                   type: string
     *                   description: La dirección de correo electrónico del usuario
     *                 lastLogin:
     *                   type: string
     *                   format: date-time
     *                   nullable: true
     *                   description: La fecha y hora del último inicio de sesión del usuario
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Error en la solicitud
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: No autorizado para acceder a este recurso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    public async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userDto = await this.userService.getUserById(id);

        if (!userDto) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(userDto);
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Crea un nuevo usuario
     *     tags: [Usuarios]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *               - roleId
     *             properties:
     *               username:
     *                 type: string
     *                 description: El nombre de usuario para el nuevo usuario
     *               email:
     *                 type: string
     *                 description: La dirección de correo electrónico para el nuevo usuario
     *               password:
     *                 type: string
     *                 description: La contraseña para el nuevo usuario
     *               roleId:
     *                 type: string
     *                 description: El ID del rol asignado al usuario
     *     responses:
     *       201:
     *         description: Usuario creado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: El ID único del usuario creado
     *                 username:
     *                   type: string
     *                   description: El nombre de usuario del usuario creado
     *                 email:
     *                   type: string
     *                   description: La dirección de correo electrónico del usuario creado
     *       400:
     *         description: Error en la solicitud o Rol no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: No autorizado para crear un usuario
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userDto: CreateUserDTO = req.body;
            const user = await this.userService.createUser(userDto);
            return res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: error });

        }
    }

    /**
     * @swagger
     * /users/{userId}:
     *   delete:
     *     summary: Elimina un usuario específico
     *     tags: [Usuarios]
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         description: El ID del usuario a eliminar
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Usuario eliminado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Usuario eliminado con éxito
     *       400:
     *         description: Error en la solicitud
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        try {
            logger.debug(`Intentando eliminar al usuario con ID: ${userId}`);
            await this.userService.deleteUser(userId);
            logger.info(`Usuario con ID: ${userId} eliminado con éxito`);
            return res.status(200).json({ message: 'Usuario eliminado con éxito' });
        } catch (error) {
            logger.error(`Error al eliminar al usuario con ID: ${userId}. Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }

    /**
     * @swagger
     * /users/{userId}:
     *   put:
     *     summary: Actualiza los detalles de un usuario específico
     *     tags: [Usuarios]
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         description: El ID del usuario a actualizar
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: El nuevo nombre de usuario
     *               email:
     *                 type: string
     *                 description: La nueva dirección de correo electrónico
     *               password:
     *                 type: string
     *                 description: La nueva contraseña
     *               roleId:
     *                 type: string
     *                 description: El nuevo ID del rol
     *             example:
     *               username: "usuario_actualizado"
     *               email: "email_actualizado@example.com"
     *               password: "nueva_contraseña"
     *               roleId: "nuevo_role_id"
     *     responses:
     *       200:
     *         description: Usuario actualizado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Error en la solicitud
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    public async updateUser(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        const updateData = req.body;
        try {
            logger.debug(`Intentando actualizar al usuario con ID: ${userId}`);
            const updatedUser = await this.userService.updateUser(userId, updateData);
            logger.info(`Usuario con ID: ${userId} actualizado con éxito`);
            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            logger.error(`Error al actualizar al usuario con ID: ${userId}. Error: ${error}`);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    };

    public routes() {
        this.router.get('/:id', verifyTokenMiddleware, this.getUserById.bind(this));
        this.router.post('/', this.createUser.bind(this));
        this.router.get('/', this.getUsers.bind(this));
        this.router.delete('/:userId', this.deleteUser.bind(this));
        this.router.put('/:userId', this.updateUser.bind(this));
    }
}
