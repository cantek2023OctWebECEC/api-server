import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { BasicEncryptionService, BcryptEncryptionService } from "./encryption.service";
import { client } from "../config/cacheconfig";
import { isNil } from "lodash";
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
	async signup({ email, username, password }: { email: string; username: string; password: string }) {
		const userCheck = await this.us.show({ where: { email } });
		if (!isNil(userCheck)) {
			throw new ValidationError("user already have account");
		}
		return await this.us.create({ email, username, password });
	}

	async signin(basicAuth: string) {
		const {username,password} = this.bes.parse(this.bes.decrypt(basicAuth));
		const userCheck = await this.us.show({ where: { username: username } });
		if (isNil(userCheck)) {
			throw new NotFoundError("Username not exsist");
		}
		if (password === userCheck.password) {
			await client.set(basicAuth, JSON.stringify({ username, password }), { EX: 3600 * 24 });
			return true;
		}
		throw new ValidationError("credential does not match");
	}
	async forgotPassword() {}
	async resetPassword() {}
	async validateToken(basicAuth: string) {
		// check redis whether the auth is found, if yes, permit passing
		return await client.exists(basicAuth);
	}
}
