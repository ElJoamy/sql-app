export interface Encrypt {
    encrypt(data: any, text: string): string;
    decrypt(text: string): string;
}
