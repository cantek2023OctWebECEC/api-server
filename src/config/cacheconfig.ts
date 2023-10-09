import { createClient } from "redis";
import { env } from "./env";

export const client = createClient({
	// username: env.RD_USER,
	// password: env.RD_PASS,
	socket: {
		host: env.RD_HOST,
		port: env.RD_PORT,
	},
});

client.on("error", (err) => console.log("Redis Client Error", err));
