import { Response } from "express";

export const NotFound = (res: Response, payload?: any) => {
	res.statusCode = 404;
	res.json(Object.assign(payload, { timestamp: new Date().toISOString() }));
};
