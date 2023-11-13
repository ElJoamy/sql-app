import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import { CreateUserDTO } from "../dtos/create.user.dto";
import { UserDto } from '../dtos/user.dto';
import logger from "../../infrastructure/logger/logger";

export class UserService {
    constructor(private userRepository: UserRepository) { }

    async getUserById(id: string): Promise<UserDto | null> {
        try {
            logger.info("Obteniendo usuario por ID en UserService"); // Registro de información
            const user = await this.userRepository.findById(id);
            if (!user) return null;

            const userResponse: UserDto = {
                id: user.id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
            return userResponse;
        } catch (error) {
            logger.error("Error al obtener usuario por ID en UserService: " + error); // Registro de error
            throw error;
        }
    }

    async createUser(userDto: CreateUserDTO): Promise<User> {
        try {
            logger.info("Creando un nuevo usuario en UserService"); // Registro de información
            const userEntity: IUserEntity = {
                username: userDto.username,
                email: userDto.email,
                passwordHash: userDto.password,
                roleId: userDto.roleId,
                createdAt: new Date(),
                lastLogin: null,
            };
            const user = new User(userEntity);
            const createdUser = await this.userRepository.createUser(user);
            logger.debug("Usuario creado con éxito en UserService"); // Registro de depuración
            return createdUser;
        } catch (error) {
            logger.error("Error al crear el usuario en UserService: " + error); // Registro de error
            throw error;
        }
    }
}