import { Service } from "typedi";
import { pgDataSource } from "../config/ormconfig";
import { Trip, User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Service()
export class TripService {
	private tripRepo = pgDataSource.getRepository(Trip);
    private userRepo = pgDataSource.getRepository(User);

	@logAsync()
	async create(trip: { organizerId: string; name: string; startDate: string }) {
        const user = await this.userRepo.findOneBy({ id: trip.organizerId });
		const newTrip = Object.assign({}, new Trip(), trip, { organizer: user, startDate: new Date(trip.startDate) });
		return await this.tripRepo.save(newTrip);
	}
	@logAsync()
	async list(opt?: FindManyOptions<Trip>) {
		return await this.tripRepo.find(opt);
	}
    @logAsync()
	async listUserTrips(organizerId: string) {
		return await this.tripRepo.findBy({ organizer: { id: organizerId} });
	}
	@logAsync()
	async show(opt: FindOneOptions<Trip>) {
		return await this.tripRepo.findOne(opt);
	}

	@logAsync()
	async update(id: string, trip: { organizerId?: string ; name?: string ; startDate?: string }) {
		const oldTrip = await this.show({ where: { id } }) || {};
        let user;
        if (trip.organizerId) {
            user = this.userRepo.findOneBy({ id: trip.organizerId });
        }
        if (trip.startDate) {
            trip = Object.assign(trip, { startDate: new Date(trip.startDate)});
        }
        const updateTrip = user ? Object.assign(new Trip(), oldTrip, trip, { organizer: user }) : Object.assign(new Trip(), oldTrip, trip);
        return await this.tripRepo.update(id, updateTrip)
	}

	@logAsync()
	async remove(id: string) {
		return await this.tripRepo.delete(id);
	}
}
