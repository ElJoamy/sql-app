import { Request, Response, Router } from 'express';
import { UserDto } from '../../app/dtos/user.dto';
import { CreateUserDTO } from '../../app/dtos/create.user.dto';
import logger from '../../infrastructure/logger/logger';
import { RoleService } from '../../app/services/roleService';
import { CreateRoleDTO } from '../../app/dtos/create.role.dto';

export class RoleController {
    public router: Router;
    private roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
        this.router = Router();
        this.routes();
    }

    /**
     * @swagger
     * /roles:
     *   post:
     *     summary: Crea un nuevo rol
     *     tags: [Roles]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - description
     *             properties:
     *               name:
     *                 type: string
     *                 description: El nombre del rol
     *               description:
     *                 type: string
     *                 description: La descripción del rol
     *             example:
     *               name: "Administrador"
     *               description: "Rol con acceso total al sistema"
     *     responses:
     *       201:
     *         description: Rol creado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: El ID único del rol creado
     *                 name:
     *                   type: string
     *                   description: El nombre del rol
     *                 description:
     *                   type: string
     *                   description: La descripción del rol
     *       400:
     *         description: Error en la solicitud
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    public async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const roleDto: CreateRoleDTO = req.body;
            const role = await this.roleService.createRole(roleDto);
            return res.status(201).json(role);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error });
        }
    }

    /**
     * @swagger
     * /roles/{id}:
     *   get:
     *     summary: Obtiene los detalles de un rol específico por su ID
     *     tags: [Roles]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: El ID único del rol
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Detalles del rol obtenidos con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: El ID único del rol
     *                 name:
     *                   type: string
     *                   description: El nombre del rol
     *                 description:
     *                   type: string
     *                   description: La descripción del rol
     *       404:
     *         description: Rol no encontrado
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
     */
    public async getRoleById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userDto = await this.roleService.getRoleById(id);

        if (!userDto) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        res.json(userDto);
    }

    /**
     * @swagger
     * /roles:
     *   get:
     *     summary: Obtiene una lista de todos los roles
     *     tags: [Roles]
     *     responses:
     *       200:
     *         description: Lista de roles obtenida con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: El ID único del rol
     *                   name:
     *                     type: string
     *                     description: El nombre del rol
     *                   description:
     *                     type: string
     *                     description: La descripción del rol
     *       400:
     *         description: Error en la solicitud
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    public async getRoles(req: Request, res: Response): Promise<void> {
        const userDto = await this.roleService.getRoles();
        res.json(userDto);
    }


    public routes() {
        this.router.get('/:id', this.getRoleById.bind(this));
        this.router.get('/', this.getRoles.bind(this));
        this.router.post('/', this.createRole.bind(this));
        //this.router.delete('/:userId', this.deleteRoleById.bind(this));
        // this.router.put('/:userId', this.updateUser.bind(this));
    }
}