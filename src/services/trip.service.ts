import { Service } from "typedi";
import { pgDataSource } from "../config/ormconfig";
import { Attraction, Trip, TripAttraction, User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { cloneDeep, isNil, omitBy, sortBy } from "lodash";
import { NotFoundError } from "../utils/errors/NotFoundError";

@Service()
export class TripService {
	private tripRepo = pgDataSource.getRepository(Trip);
	private userRepo = pgDataSource.getRepository(User);
	private tripAttrRepo = pgDataSource.getRepository(TripAttraction);

	@logAsync()
	async create(trip: { organizerId: string; name: string; startDate: string }) {
		const user = await this.userRepo.findOneBy({ id: trip.organizerId });
		if (isNil(user)) {
			throw new NotFoundError("User not exsist");
		}
		const newTrip = Object.assign({}, new Trip(), trip, { organizer: user, startDate: new Date(trip.startDate) });
		return await this.tripRepo.save(newTrip);
	}
	@logAsync()
	async list(opt?: FindManyOptions<Trip>) {
		return await this.tripRepo.find(opt);
	}
	@logAsync()
	async listUserTrips(organizerId: string) {
		return await this.tripRepo.findBy({ organizer: { id: organizerId } });
	}
	@logAsync()
	async show(opt: FindOneOptions<Trip>) {
		return await this.tripRepo.findOne(opt);
	}

	@logAsync()
	async update(id: string, trip: { organizerId?: string; name?: string; startDate?: string }) {
		const oldTrip = (await this.show({ where: { id } })) || {};
		let user;
		if (trip.organizerId) {
			user = this.userRepo.findOneBy({ id: trip.organizerId });
			if (isNil(user)) {
				throw new NotFoundError("User not exsist");
			}
		}
		if (trip.startDate) {
			trip = Object.assign(trip, { startDate: new Date(trip.startDate) });
			if (isNil(oldTrip)) {
				throw new NotFoundError("Trip not exsist");
			}
		}
		const updateTrip = omitBy(
			{
				organiser: user,
				startDate: trip.startDate,
				name: trip.name,
				updatedAt: new Date().toISOString(),
			},
			isNil
		);
		return await this.tripRepo.update(id, updateTrip);
	}

	@logAsync()
	async remove(id: string) {
		return await this.tripRepo.delete(id);
	}

	@logAsync()
	async associateAttraction(tripid: string, attractionid: string, { order }: { order: number }) {
		const tripAttr = await this.tripAttrRepo.find({ where: { tripid } });
		const updatedTripAttr = tripAttr.map((e) => {
			if (e.order >= order) {
				e.order = e.order + 1;
			}
			return e;
		});
		updatedTripAttr.push(Object.assign(new TripAttraction(), { tripid, attractionid, order }));
		return await this.tripAttrRepo.save(updatedTripAttr);
	}

	@logAsync()
	async dissociateAttraction(tripid: string, attractionid: string) {
		const tripAttr = await this.tripAttrRepo.find({ where: { tripid } });
		const updatedTripAttr = sortBy(tripAttr, "order")
			.filter((e) => e.attractionid !== attractionid)
			.map((e, i) => (e.order === i + 1 ? { ...e } : { ...e, order: i + 1 }));
		this.tripAttrRepo.delete({ tripid, attractionid });
		return await this.tripAttrRepo.save(updatedTripAttr);
	}

	@logAsync()
	async updateAttractionOrder(tripid: string, attractionid: string, { order }: { order: number }) {
		const tripAttr = await this.tripAttrRepo.find({ where: { tripid } });
		const saved = tripAttr.find((e) => e.attractionid === attractionid);
		if (isNil(saved)) {
			throw new NotFoundError("cannot find the attractionid");
		}
		const updatedTripAttr = sortBy(tripAttr, "order")
			.filter((e) => e.attractionid !== attractionid)
			.map((e, i) => (e.order === i + 1 ? { ...e } : { ...e, order: i + 1 })) // dissociate
			.map((e, i) => (e.order >= order ? { ...e, order: e.order + 1 } : { ...e })); // reassociate

		updatedTripAttr.push({ ...saved, order });
		return await this.tripAttrRepo.save(updatedTripAttr);
	}
	@logAsync()
	async associateParticipant(tripid: string, participantid: string) {
		const trip = await this.tripRepo.findOne({ where: { id: tripid }, relations: { participants: true } });
		const user = await this.userRepo.findOne({ where: { id: participantid } });
		if (isNil(trip) || isNil(user)) {
			throw new NotFoundError("not found for id");
		}
		const participantList = cloneDeep(trip?.participants ?? []);
		participantList?.push(user);
		trip.participants = participantList;
		return await this.tripRepo.save(trip);
	}

	@logAsync()
	async dissociateParticipant(tripid: string, participantid: string) {
		const trip = await this.tripRepo.findOne({ where: { id: tripid }, relations: { participants: true } });
		const user = await this.userRepo.findOne({ where: { id: participantid } });
		if (isNil(trip) || isNil(user)) {
			throw new NotFoundError("not found for id");
		}
		const participantList = trip.participants.filter((e) => e.id !== participantid);
		trip.participants = participantList;
		return await this.tripRepo.save(trip);
	}
}
