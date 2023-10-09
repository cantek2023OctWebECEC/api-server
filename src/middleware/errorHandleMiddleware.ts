import { NotFoundError } from "../utils/errors/NotFoundError";
import { ValidationError } from "../utils/errors/ValidationError";
import { logger } from "../utils/logger";
import { BadRequest } from "../utils/responses/BadRequest";
import { InternalServerError } from "../utils/responses/InternalServerError";
import { NotFound } from "../utils/responses/NotFound";

export const errorHandlerMiddleware = (err, req, res, next) => {
	logger.error(err.stack);
	if (err instanceof ValidationError) {
		return BadRequest(res, err);
	}
	if (err instanceof NotFoundError) {
		return NotFound(res, err);
	}
	if (err) {
		return InternalServerError(res, err);
	}
};
