import { z } from "zod";
export const createTodoSchema = z.object({
	body: z.object({
		assigneeId: z.string(),
        tripId: z.string(),
		title: z.string(),
		description: z.string(),
	}),
});
export const updateTodoSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: z
		.object({
			assigneeId: z.string(),
            tripId: z.string(),
		    title: z.string(),
		    description: z.string(),
            inprogress: z.boolean(),
            done: z.boolean(),
		})
		.partial(),
});
export const deleteTodoSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const showTodoSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
export const listUserTodoSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
