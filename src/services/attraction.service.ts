import { Service } from "typedi";
import { pgDataSource } from "../config/ormconfig";
import { Attraction, Trip, TripAttraction, User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { cloneDeep, isNil, omitBy, sortBy } from "lodash";
import { NotFoundError } from "../utils/errors/NotFoundError";

@Service()
export class AttractionService {
	private attrRepo = pgDataSource.getRepository(Attraction);

	@logAsync()
	async list(opt?: FindManyOptions<Attraction>) {
		return await this.attrRepo.find(opt);
	}
}
