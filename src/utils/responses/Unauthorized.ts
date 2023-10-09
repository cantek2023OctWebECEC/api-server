import { Response } from "express";

export const Unauthorized = (res: Response, payload?: any) => {
	res.statusCode = 401;
	res.json(Object.assign(payload, { timestamp: new Date().toISOString() }));
};
