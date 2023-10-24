import { z } from "zod";
export const createTripSchema = z.object({
	body: z.object({
		organizerId: z.string(),
		name: z.string(),
		startDate: z.string(),
	}),
});
export const updateTripSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: z
		.object({
			organizerId: z.string(),
			name: z.string(),
			startDate: z.string(),
		})
		.partial(),
});
export const deleteTripSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const showTripSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const listUserTripSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const associateUpdateAttractionSchema = z.object({
	params: z.object({
		tripid: z.string(),
		attractionid: z.string(),
	}),
	body: z.object({
		order: z.number(),
	}),
});
export const dissociateAttractionSchema = z.object({
	params: z.object({
		tripid: z.string(),
		attractionid: z.string(),
	}),
});
export const assodissoParticipantSchema = z.object({
	params: z.object({
		tripid: z.string(),
		participantid: z.string(),
	}),
});
