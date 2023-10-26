import express, { Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server } from "socket.io";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { BasicAuthMiddleware } from "./middleware/basicAuthMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandleMiddleware";
import { UserController } from "./controllers/user.controller";
import { authController } from "./controllers/auth.controller";
import { client } from "./config/cacheconfig";
import { mgDataSource, pgDataSource } from "./config/ormconfig";
import { RouteController } from "./controllers/route.controller";
import { TripController } from "./controllers/trip.controller";
import { TodoController } from "./controllers/todo.controller";
import { CommentController } from "./controllers/comment.controller";
import { queryParser } from "express-query-parser";
import { AttractionController } from "./controllers/attraction.controller";
const app = express();
app.use(cors()); // cors
app.use(express.json()); // json body parser
app.use(
	queryParser({
		parseNull: true,
		parseUndefined: true,
		parseBoolean: true,
		parseNumber: true,
	})
);
//add middleware and router
app.use("/api/auth", authController);
app.use(BasicAuthMiddleware);
app.use("/api/attraction", AttractionController);
app.use("/api/user", UserController);
app.use("/api/route", RouteController);
app.use("/api/comment", CommentController);
app.use("/api/todo", TodoController);
app.use("/api/trip", TripController);
app.use(errorHandlerMiddleware);

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: env.FRONTEND_HOST,
	},
});
io.on("connection", (socket) => {
	logger.info("a user connected");
	socket.on("disconnect", () => {
		logger.info("user disconnected");
	});
});
server.listen(env.APP_PORT, async () => {
	// startup job e.g. typeorm
	await pgDataSource.initialize();
	await mgDataSource.initialize();
	// redis setup etc.
	await client.connect();

	logger.info(`server is now running on ${env.APP_PORT}`);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
	console.log("Received kill signal, shutting down gracefully");
	server.close(async () => {
		console.log("Closed out remaining connections");
		await client.disconnect();
		process.exit(0);
	});

	setTimeout(() => {
		console.error("Could not close connections in time, forcefully shutting down");
		process.exit(1);
	}, 10000);
}
