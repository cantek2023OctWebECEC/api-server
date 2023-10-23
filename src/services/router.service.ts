// this service is used for path finding the data shall be saved in mongo after query for accessing effectively.

import { get as _get, toString } from "lodash"
import { Service } from "typedi";
import { Point } from "typeorm"
import { env } from "../config/env";
import { logAsync } from "../utils/decorators/logDecorator";
import { GeoJSON } from "../utils/types/GeoJSON";
import Openrouteservice from "openrouteservice-js";
import { Navigation } from "../database/mongo/entities";
import { mgDataSource } from "../config/ormconfig";
export enum ERouteProfile {
	DRIVING_CAR = "driving-car",
	DRIVING_HGV = "driving-hgv",
	CYCLING_REGULAR = "cycling-regular",
	CYCLING_ROAD = "cycling-road",
	CYCLING_MOUNTAIN = "cycling-mountain",
	CYCLING_ELECTRIC = "cycling-electric",
	FOOT_WALKING = "foot-walking",
	FOOT_HIKING = "foot-hiking",
	WHEEL_CHAIR = "wheel-chair",
}

@Service()
export class RouterService {

	private navRepo = mgDataSource.getRepository(Navigation);
	
	@logAsync()
	public async findRoute(from: Point, to: Point, profile: ERouteProfile) {
		let orsDirections = new Openrouteservice.Directions({ api_key: env.ORS_API_KEY });
		const result = await orsDirections.calculate({
			coordinates: [from.coordinates, to.coordinates],
			profile: profile,
			format: "geojson",
		});
		return result;
	}

	@logAsync()
	public async createNavigation(navgation: Partial<Navigation>) {
		const coordinates = toString(_get(navgation, 'metadata.query.coordinates', []));
		const profile = _get(navgation, 'metadata.query.profile', '');
		const newNav = Object.assign({}, new Navigation(), navgation, { coordinates, profile });
		return await this.navRepo.insert(newNav);
	}

	@logAsync()
	public async showNavigation(from: Point, to: Point, profile: ERouteProfile) {
		const coordinates = toString([_get(from, 'coordinates', []), _get(to, 'coordinates', [])]);
		return await this.navRepo.findOneBy({ coordinates, profile });
	}
}
