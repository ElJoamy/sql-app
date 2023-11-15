import { Encrypt } from "../../app/utils/encrypt";
import { jwt as jwtConfig } from '../config/config';
import jwt from 'jsonwebtoken';

export class EncryptImpl implements Encrypt {
    encrypt(data: any, text: string): string {
        const token = jwt.sign(data , jwtConfig.secretKey, { expiresIn: '1h' });
        return token;
    }
    decrypt(text: string): string {
        throw new Error("Method not implemented.");
    }

}