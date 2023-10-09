import { DataSource } from "typeorm";
import { env } from "./env";
import * as pgEntities from "../database/postgres/entities";

export const mgDataSource = new DataSource({
	type: "mongodb",
	host: env.MG_HOST,
	port: env.MG_PORT,
	username: env.MG_USER,
	password: env.MG_PASS,
	logging: true,
});

export const pgDataSource = new DataSource({
	type: "postgres",
	host: env.PG_HOST,
	port: env.PG_PORT,
	username: env.PG_USER,
	password: env.PG_PASS,
	database: env.PG_DB,
	synchronize: true,
	logging: true,
	entities: [...Object.values(pgEntities)],
});
