// this service is used for path finding the data shall be saved in mongo after query for accessing effectively.

import { Service } from "typedi";
import { env } from "../config/env";
import { logAsync } from "../utils/decorators/logDecorator";
import { GeoJSON } from "../utils/types/GeoJSON";
import Openrouteservice from "openrouteservice-js";
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
	@logAsync()
	public async findRoute(from: GeoJSON.Point, to: GeoJSON.Point, profile: ERouteProfile) {
		let orsDirections = new Openrouteservice.Directions({ api_key: env.ORS_API_KEY });
		const result = await orsDirections.calculate({
			coordinates: [from.coordinates, to.coordinates],
			profile: profile,
			format: "json",
		});
		return result;
	}
}
