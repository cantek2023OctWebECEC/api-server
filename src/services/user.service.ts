import { Inject, Service } from "typedi";
import { BcryptEncryptionService } from "./encryption.service";
import { pgDataSource } from "../config/ormconfig";
import { User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { isNil, omitBy } from "lodash";

@Service()
export class UserService {
	@Inject(() => BcryptEncryptionService)
	private bes: BcryptEncryptionService;

	private userRepo = pgDataSource.getRepository(User);

	@logAsync()
	async create(user: Partial<User> & { email: string; username: string; password: string }) {
		const newUser = Object.assign({}, new User(), user, { password: await this.bes.encrypt(user.password) });
		return await this.userRepo.save(newUser);
	}
	@logAsync()
	async list(opt?: FindManyOptions<User>) {
		return await this.userRepo.find(opt);
	}
	@logAsync()
	async show(opt: FindOneOptions<User>) {
		return await this.userRepo.findOne(opt);
	}

	@logAsync()
	async update(id: string, user: Partial<User>) {
		const oldUser = await this.show({ where: { id } });
		if (isNil(oldUser)) {
			return;
		}
		const pwObj: Partial<User> = {};
		if (user.password) {
			pwObj.password = await this.bes.encrypt(user.password);
		}
		const updatedUser = omitBy({
            ...user,
			...pwObj,
        }, isNil);
		return await this.userRepo.update(id, updatedUser)
	}

	@logAsync()
	async remove(id: string) {
		return await this.userRepo.delete(id);
	}
}
