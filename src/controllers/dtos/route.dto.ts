import { z } from "zod";
import { ERouteProfile } from "../../services/router.service";
export const GeoJsonPoint = z.object({
	type: z.literal("Point"),
	bbox: z.number().array().optional(),
	coordinates: z.number().array().min(2).max(3),
});
export const findRouteSchema = z.object({
	body: z.object({
		from: GeoJsonPoint,
		to: GeoJsonPoint,
	}),
	params: z.object({
		profile: z.nativeEnum(ERouteProfile),
	}),
});
