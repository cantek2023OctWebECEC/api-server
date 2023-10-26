import { DataSource } from "typeorm";
import { env } from "./env";
import * as pgEntities from "../database/postgres/entities";
import * as mgEntities from "../database/mongo/entities";

export const mgDataSource = new DataSource({
	type: "mongodb",
	host: env.MG_HOST,
	port: env.MG_PORT,
	username: env.MG_USER,
	password: env.MG_PASS,
	logging: true,
	synchronize: true,
	entities: [...Object.values(mgEntities)],
});

export const pgDataSource = new DataSource({
	type: "postgres",
	host: env.PG_HOST,
	port: env.PG_PORT,
	username: env.PG_USER,
	password: env.PG_PASS,
	database: env.PG_DB,
	synchronize: false,
	logging: true,
	entities: [...Object.values(pgEntities)],
});
