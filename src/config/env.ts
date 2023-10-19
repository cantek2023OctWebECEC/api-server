import { config } from "dotenv";
import { cleanEnv, port, str, url } from "envalid";
config();

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ devDefault: "development" }),
	APP_PORT: port({ devDefault: 4000 }),
	PG_HOST: str(),
	PG_PORT: port(),
	PG_USER: str(),
	PG_PASS: str(),
	PG_DB: str(),
	MG_HOST: str(),
	MG_PORT: port(),
	MG_USER: str(),
	MG_PASS: str(),
	RD_HOST: str(),
	RD_PORT: port(),
	RD_USER: str({ default: "" }),
	RD_PASS: str({ default: "" }),
	ORS_API_KEY: str(),
	FRONTEND_HOST: url(),
});
