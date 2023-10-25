import { z } from "zod";
export const createUserSchema = z.object({
	body: z.object({
		username: z.string(),
		email: z.string(),
		password: z.string(),
	}),
});
export const updateUserSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: z
		.object({
			username: z.string(),
			email: z.string(),
			password: z.string(),
		})
		.partial(),
});
export const deleteUserSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export const showUserSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export const getUserInfoSchema = z.object({
	headers: z.object({
		authorization: z.string(),
	}),
});

export const getUserByEmailSchema = z.object({
	body: z.object({
		email: z.string(),
	}),
});
