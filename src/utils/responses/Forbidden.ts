import { Response } from "express";

export const Forbidden = (res: Response, payload?: any) => {
	res.statusCode = 403;
	res.json(Object.assign(payload, { timestamp: new Date().toISOString() }));
};
