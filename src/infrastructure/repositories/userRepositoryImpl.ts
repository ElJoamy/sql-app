import { UserRepository } from "../../domain/interfaces/userRepository";
import { UserEntity } from "../entities/userEntity";
import { AppDataSource } from "../config/dataSource";
import { User } from "../../domain/models/user";
import { UserDto } from "../../app/dtos/user.dto";

export class UserRepositoryImpl implements UserRepository {
    async findById(id: string): Promise<User | null> {
        const userEntity = await AppDataSource.getRepository(UserEntity).findOneBy({ id });
        return userEntity ? new User(userEntity) : null;
    }

    async createUser(user: User): Promise<UserDto> {
        const userEntity = AppDataSource.getRepository(UserEntity).create({
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt || new Date(),
            lastLogin: user.lastLogin || undefined,
            roleId: user.roleId
        });

        const userResponse = await AppDataSource.getRepository(UserEntity).save(userEntity);
        const userResult: UserDto = {
            id: userResponse.id,
            username: userResponse.username,
            email: userResponse.email,
            lastLogin: userResponse.lastLogin
        };
        return userResult;
        
    }
}
