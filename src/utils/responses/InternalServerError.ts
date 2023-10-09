import { Response } from "express";

export const InternalServerError = (res: Response, payload?: any) => {
	res.statusCode = 500;
	res.json(Object.assign(payload, { timestamp: new Date().toISOString() }));
};
