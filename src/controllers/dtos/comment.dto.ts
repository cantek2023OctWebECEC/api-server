import { z } from "zod";
export const createCommentSchema = z.object({
	body: z.object({
		userId: z.string(),
        tripId: z.string(),
		content: z.string(),
	}),
});
export const updateCommentSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: z
		.object({
            content: z.string(),
		})
		.partial(),
});
export const deleteCommentSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const showCommentSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const listUserCommentSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
