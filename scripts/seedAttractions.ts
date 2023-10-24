import Attraction from "../src/database/postgres/entities/Attraction";
import { pgDataSource } from "../src/config/ormconfig";
import { default as jsonArray } from "./attractions.json";
export async function seed() {
	if (!pgDataSource.isInitialized) {
		await pgDataSource.initialize();
	}
	const repo = pgDataSource.getRepository(Attraction);
	const ids = (await repo.find({ select: { id: true } })).map((e) => e.id);
	if (ids.length > 0) {
		await repo.delete(ids);
	}
	const attractionArr = jsonArray.map((e) => {
		return Object.assign(new Attraction(), {
			name: e.NAME,
			postal_code: e.POSTAL_CODE,
			description: e.ATTRACTION,
			location: JSON.parse(e.geometry),
			address_full: e.ADDRESS_FULL,
			category: e.CATEGORY,
			email: e.EMAIL,
			phone: e.PHONE,
			website: e.WEBSITE,
		});
	});
	await repo.save(attractionArr);
}
seed();
