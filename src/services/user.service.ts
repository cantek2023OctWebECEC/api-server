import { Inject, Service } from "typedi";
import { BasicEncryptionService, BcryptEncryptionService } from "./encryption.service";
import { pgDataSource } from "../config/ormconfig";
import { User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { isNil, omitBy } from "lodash";
import { NotFoundError } from "../utils/errors/NotFoundError";

@Service()
export class UserService {
	@Inject(() => BasicEncryptionService)
	private bes: BasicEncryptionService;
	@Inject(() => BcryptEncryptionService)
	private ces: BcryptEncryptionService;

	private userRepo = pgDataSource.getRepository(User);

	@logAsync()
	async create(user: Partial<User> & { email: string; username: string; password: string }) {
		const newUser = Object.assign({}, new User(), user, { password: await this.ces.encrypt(user.password) });
		return await this.userRepo.save(newUser);
	}
	@logAsync()
	async list(opt?: FindManyOptions<User>) {
		return await this.userRepo.find(opt);
	}
	@logAsync()
	async show(opt: FindOneOptions<User>) {
		const user = await this.userRepo.findOne(opt);
		if (isNil(user)) {
			throw new NotFoundError("User not exsist");
		}
		return user;
	}

	@logAsync()
	async update(id: string, user: Partial<User>) {
		const oldUser = await this.show({ where: { id } });
		if (isNil(oldUser)) {
			throw new NotFoundError("User not exsist");
		}
		const pwObj: Partial<User> = {};
		if (user.password) {
			pwObj.password = await this.ces.encrypt(user.password);
		}
		const updatedUser = omitBy({
            ...user,
			...pwObj,
        }, isNil);
		return await this.userRepo.update(id, updatedUser);
	}

	@logAsync()
	async remove(id: string) {
		return await this.userRepo.delete(id);
	}

	@logAsync()
	async getUserByHeader(basicAuth: string) {
		const { username } = this.bes.parse(this.bes.decrypt(basicAuth));
		const userInfo = await this.show({
			where: { email: username },
			relations: { trips: true },
			select: ['id', 'email', 'trips', 'username', 'lastLogin']
		});
		if (isNil(userInfo)) {
			throw new NotFoundError("User not exsist");
		}
		return userInfo;
	}

}
