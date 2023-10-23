import { Router } from "express";
import Container from "typedi";
import { TripService } from "../services/trip.service";
import { createTripSchema, deleteTripSchema, listUserTripSchema, showTripSchema, updateTripSchema } from "./dtos/trip.dto";
import { Success } from "../utils/responses/Success";

export const TripController = Router();

TripController.post("/", async (req, res, next) => {
	try {
		const { body } = await createTripSchema.parse(req);
		const result = await Container.get(TripService).create(body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TripController.get("/", async (req, res, next) => {
	try {
		const result = await Container.get(TripService).list();
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TripController.get("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await showTripSchema.parse(req);
		const result = await Container.get(TripService).show({
            where: { id },
            relations: { organizer: true },
            select: {
                organizer: {
                    id: true,
                    username: true,
                }
            }
        });
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

TripController.get("/listusertrips/:id", async (req, res, next) => {
	try {
        const {
			params: { id },
		} = await listUserTripSchema.parse(req);
		const result = await Container.get(TripService).listUserTrips(id);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});


TripController.put("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
			body,
		} = await updateTripSchema.parse(req);
		const result = await Container.get(TripService).update(id, body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
TripController.delete("/:id", async (req, res, next) => {
	try {
		const {
			params: { id },
		} = await deleteTripSchema.parse(req);
		const result = await Container.get(TripService).remove(id);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
