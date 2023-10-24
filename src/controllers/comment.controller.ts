import { Router } from "express";
import Container from "typedi";
import { CommentService } from "../services/comment.service";
import { createCommentSchema, deleteCommentSchema, showCommentSchema, updateCommentSchema } from "./dtos/comment.dto";
import { Success } from "../utils/responses/Success";

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
                }
            }
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
