import { Response } from "express";

export const BadRequest = (res: Response, payload?: any) => {
	res.statusCode = 400;
	res.json(Object.assign(payload, { timestamp: new Date().toISOString() }));
};
