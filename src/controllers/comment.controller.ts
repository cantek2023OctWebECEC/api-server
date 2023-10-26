import { Router } from "express";
import Container from "typedi";
import { CommentService } from "../services/comment.service";
import {
	createCommentSchema,
	deleteCommentSchema,
	showCommentSchema,
	updateCommentSchema,
	listCommentSchema,
} from "./dtos/comment.dto";
import { Success } from "../utils/responses/Success";
import { set } from "lodash";
import { ValidationError } from "../utils/errors/ValidationError";

export const CommentController = Router();

CommentController.post("/", async (req, res, next) => {
	try {
		const { body } = await createCommentSchema.parse(req);
		const result = await Container.get(CommentService).create(body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

CommentController.post("/list", async (req, res, next) => {
	try {
		const {
			query: { tripId, userId },
		} = await listCommentSchema.parse(req);
		const whereQuery = {};
		if (tripId) set(whereQuery, "trip.id", tripId);
		if (userId) set(whereQuery, "user.id", userId);
		if (!tripId && !userId) {
			throw new ValidationError("Query must have either tripId or userId");
		}
		const result = await Container.get(CommentService).list({
			where: whereQuery,
			relations: { user: true },
		});
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

CommentController.get("/", async (req, res, next) => {
	try {
		const result = await Container.get(CommentService).list();
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

CommentController.get("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await showCommentSchema.parse(req);
		const result = await Container.get(CommentService).show({
			where: { id },
			relations: { user: true, trip: true },
			select: {
				user: {
					id: true,
					username: true,
				},
				trip: {
					id: true,
					name: true,
				},
			},
		});
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

CommentController.put("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
			body,
		} = await updateCommentSchema.parse(req);
		const result = await Container.get(CommentService).update(id, body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

CommentController.delete("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await deleteCommentSchema.parse(req);
		const result = await Container.get(CommentService).remove(id);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
