import { Router } from "express";
import Container from "typedi";
import { TodoService } from "../services/todo.service";
import { createTodoSchema, deleteTodoSchema, showTodoSchema, updateTodoSchema, listTodoSchema } from "./dtos/todo.dto";
import { Success } from "../utils/responses/Success";
import { ValidationError } from "../utils/errors/ValidationError";
import { set } from "lodash";

export const TodoController = Router();

TodoController.post("/", async (req, res, next) => {
	try {
		const { body } = await createTodoSchema.parse(req);
		const result = await Container.get(TodoService).create(body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TodoController.post("/list", async (req, res, next) => {
	try {
		const {
			query: { tripId, userId },
		} = await listTodoSchema.parse(req);
		const whereQuery = {};
		if(tripId) set(whereQuery, 'trip.id', tripId);
		if(userId) set(whereQuery, 'assignee.id', userId);
		if(!tripId && !userId) {
			throw new ValidationError("Query must have either tripId or userId");
		}
		const result = await Container.get(TodoService).list({
			where: whereQuery, 
		});
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TodoController.get("/", async (req, res, next) => {
	try {
		const result = await Container.get(TodoService).list();
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TodoController.get("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await showTodoSchema.parse(req);
		const result = await Container.get(TodoService).show({
            where: { id },
            relations: { assignee: true, trip: true },
            select: {
                assignee: {
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

TodoController.put("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
			body,
		} = await updateTodoSchema.parse(req);
		const result = await Container.get(TodoService).update(id, body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TodoController.delete("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await deleteTodoSchema.parse(req);
		const result = await Container.get(TodoService).remove(id);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
