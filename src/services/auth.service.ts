import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { BasicEncryptionService, BcryptEncryptionService } from "./encryption.service";
import { pgDataSource } from "../config/ormconfig";
import { User } from "../database/postgres/entities";
import { client } from "../config/cacheconfig";
import { isNil, random } from "lodash";
import { logAsync } from "../utils/decorators/logDecorator";
import { ValidationError } from "../utils/errors/ValidationError";
import { NotFoundError } from "../utils/errors/NotFoundError";

@Service()
export class AuthService {
	@Inject(() => UserService)
	private us: UserService;
	@Inject(() => BasicEncryptionService)
	private bes: BasicEncryptionService;
	@Inject(() => BcryptEncryptionService)
	private ces: BcryptEncryptionService;

	private userRepo = pgDataSource.getRepository(User);

	async signup({ email, username, password }: { email: string; username: string; password: string }) {
		const userCheck = await this.us.show({ where: { email } });
		if (!isNil(userCheck)) {
			throw new ValidationError("user already have account");
		}
		return await this.us.create({ email, username, password });
	}

	async signin(basicAuth: string) {
		const {username,password} = this.bes.parse(this.bes.decrypt(basicAuth));
		const userCheck = await this.us.show({ where: { email: username } });
		if (isNil(userCheck)) {
			throw new NotFoundError("Username not exsist");
		}
		if (await this.ces.compare(password, userCheck.password)) {
			await client.set(basicAuth, JSON.stringify({ username, password }), { EX: 3600 * 24 });
			await this.userRepo.update(userCheck.id, { lastLogin: new Date().toISOString()});
			return true;
		}
		throw new ValidationError("credential does not match");
	}
	async forgotPassword() {}

	@logAsync()
	async resetPassword(email: string) {
		const userCheck = await this.us.show({ where: { email } });
		if (isNil(userCheck)) {
			throw new NotFoundError("Username not exsist");
		}
		const password = Math.round((Math.pow(36, 8 + 1) - Math.random() * Math.pow(36, 8))).toString(36).slice(1);
		const encryptedPassword = await this.ces.encrypt(password)
		await this.userRepo.update(userCheck.id, { password: encryptedPassword });
		return { password };
	}

	async validateToken(basicAuth: string) {
		// check redis whether the auth is found, if yes, permit passing
		return await client.exists(basicAuth);
	}
}
