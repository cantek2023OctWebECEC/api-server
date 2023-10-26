import { Router } from "express";
import Container from "typedi";
import { UserService } from "../services/user.service";
import {
	createUserSchema,
	deleteUserSchema,
	showUserSchema,
	getUserInfoSchema,
	getUserByEmailSchema,
	updateUserSchema,
} from "./dtos/user.dto";
import { Success } from "../utils/responses/Success";

export const UserController = Router();

UserController.post("/", async (req, res, next) => {
	try {
		const { body } = await createUserSchema.parse(req);
		const result = await Container.get(UserService).create(body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
UserController.get("/", async (req, res, next) => {
	try {
		const {
			headers: { authorization },
		} = await getUserInfoSchema.parse(req);
		const result = await Container.get(UserService).getUserByHeader(authorization);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

UserController.get("/list", async (req, res, next) => {
	try {
		const result = await Container.get(UserService).list();
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

UserController.get("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await showUserSchema.parse(req);
		const result = await Container.get(UserService).show({
			where: { id },
			relations: { hostedTrip: true, todos: true, jointTrip: true, comments: true },
			select: ["id", "email", "todos", "comments", "hostedTrip", "jointTrip", "username", "lastLogin"],
		});
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

UserController.post("/get-user-email", async (req, res, next) => {
	try {
		const {
			body: { email },
		} = await getUserByEmailSchema.parse(req);
		const result = await Container.get(UserService).show({
			where: { email },
			relations: { hostedTrip: true, todos: true, jointTrip: true, comments: true },
			select: ["id", "email", "todos", "comments", "hostedTrip", "jointTrip", "username", "lastLogin"],
		});
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

UserController.put("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
			body,
		} = await updateUserSchema.parse(req);
		const result = await Container.get(UserService).update(id, body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
UserController.delete("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await deleteUserSchema.parse(req);
		const result = await Container.get(UserService).remove(id);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
