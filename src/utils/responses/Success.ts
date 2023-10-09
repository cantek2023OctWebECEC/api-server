import { Response } from "express";

export const Success = (res: Response, payload?: any) => {
	res.statusCode = 200;
	res.json(Object.assign(payload, { timestamp: new Date().toISOString() }));
};
