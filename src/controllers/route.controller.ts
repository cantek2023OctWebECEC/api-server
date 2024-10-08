import { Router } from "express";
import Container from "typedi";
import { AuthService } from "../services/auth.service";
import z from "zod";
import { signinSchema, signupSchema } from "./dtos/auth.dto";
import { Success } from "../utils/responses/Success";
import { RouterService } from "../services/router.service";
import { findRouteSchema, createNavigationSchema } from "./dtos/route.dto";

export const RouteController = Router();

RouteController.post("/search/:profile", async (req, res, next) => {
	try {
		const {
			body: { from, to },
			params: { profile },
		} = await findRouteSchema.parse(req);
		// @ts-ignore zod schema already check whther it is validate to point but it cannot generate schema with correct length of element
		let result;
		result = await Container.get(RouterService).showNavigation(from, to, profile)
		if (!result){
			const routeResult = await Container.get(RouterService).findRoute(from, to, profile);
			result = await Container.get(RouterService).createNavigation(routeResult);
		}
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});

RouteController.post("/createNavigation", async (req, res, next) => {
	try {
		const { body } = await createNavigationSchema.parse(req);
		// @ts-ignore zod schema already check whther it is validate to point but it cannot generate schema with correct length of element
		const result = await Container.get(RouterService).createNavigation(body);
		return Success(res, result);
	} catch (err) {
		next(err);
	}
});
