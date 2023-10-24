import { Request } from "express";
import { Forbidden } from "../utils/responses/Forbidden";
import { isNil } from "lodash";
import Container from "typedi";
import { AuthService } from "../services/auth.service";
import { Unauthorized } from "../utils/responses/Unauthorized";

export const BasicAuthMiddleware = (req: Request, res, next) => {
	if (!req.headers.authorization) {
		return Forbidden(res, "authorization not found");
	}
	try {
		const basic = req.headers.authorization.split(" ")[1];
		if (isNil(Container.get(AuthService).validateToken(basic))) {
			return Unauthorized(res, "authorization not found");
		}
	} catch (err) {
		next(err);
	}
	next();
};
