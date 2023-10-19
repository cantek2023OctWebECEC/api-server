import { z } from "zod";
export const signupSchema = z.object({
	body: z.object({
		username: z.string().min(3),
		password: z.string().min(8),
		email: z.string().email(),
	}),
});
export const signinSchema = z.object({
	headers: z.object({
		authorization: z.string(),
	}),
});
