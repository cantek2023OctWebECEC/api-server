import { Service } from "typedi";
import { log, logAsync } from "../utils/decorators/logDecorator";
import bcrypt from "bcrypt";

export interface IEncryptionService<T> {
	stringify?: (obj: T) => string;
	parse?: (text: string) => T;
	encrypt: (text: string) => string | Promise<string>;
	decrypt?: (text: string) => string | Promise<string>;
	compare?: (text: string, cipherText: string) => boolean | Promise<boolean>;
}

@Service()
export class BasicEncryptionService implements IEncryptionService<{ username: string; password: string }> {
	@log()
	stringify(obj) {
		return `${obj.username}:${obj.password}`;
	}
	@log()
	parse(text) {
		const [username, password] = text.split(":");
		return { username, password };
	}
	@log()
	encrypt(text) {
		return Buffer.from(text).toString("base64");
	}
	@log()
	decrypt(text) {
		return Buffer.from(text, "base64").toString("utf-8");
	}
}
@Service()
export class BcryptEncryptionService implements IEncryptionService<undefined> {
	@logAsync()
	async encrypt(text) {
		return await bcrypt.hash(text, 10);
	}
	@logAsync()
	async compare(text, cipherText) {
		return await bcrypt.compare(text, cipherText);
	}
}
