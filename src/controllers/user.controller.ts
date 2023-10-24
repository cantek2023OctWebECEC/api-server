import { Router } from "express";
import Container from "typedi";
import { UserService } from "../services/user.service";
import { createUserSchema, deleteUserSchema, showUserSchema, updateUserSchema } from "./dtos/user.dto";
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
			relations: { trips: true },
			select: ['id', 'email', 'trips', 'username']
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
