import { Router } from "express";
import { Success } from "../utils/responses/Success";
import Container from "typedi";
import { AttractionService } from "../services/attraction.service";

export const AttractionController = Router();
AttractionController.get("/", async (req, res, next) => {
	try {
		const result = await Container.get(AttractionService).list();
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
