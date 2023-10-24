import { Router } from "express";
import Container from "typedi";
import { AuthService } from "../services/auth.service";
import z from "zod";
import { resetSchema, signinSchema, signupSchema } from "./dtos/auth.dto";
import { Success } from "../utils/responses/Success";

export const authController = Router();

authController.post("/login", async (req, res, next) => {
	try {
		const {
			headers: { authorization },
		} = await signinSchema.parse(req);
		const result = await Container.get(AuthService).signin(authorization);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
authController.post("/signup", async (req, res, next) => {
	try {
		const { body } = await signupSchema.parse(req);
		const result = await Container.get(AuthService).signup(body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
authController.post("/resetPassword", async (req, res, next) => {
	try {
		const { body: { email } } = await resetSchema.parse(req);
		const result = await Container.get(AuthService).resetPassword(email);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
