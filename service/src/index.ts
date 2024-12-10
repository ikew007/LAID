import log from "./log";
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { buildClient } from "./smart-contracts/smart-contract";

import auth from "./api/auth.routes";
import personalData from "./api/personalData.routes";

main();

function requestLogger(req: Request, res: Response, next: NextFunction) {
	log(`Request: ${req.method} ${req.url} Body: ${JSON.stringify(req.body)}`, 'c');
	next();
}

async function main() {
	log("Leo & Andrii Identification (LAID) v1.0.0", 'c');
	dotenv.config();

	const app: Express = express();
	const port = process.env.PORT || 3000;

	log("Building contract...", 'c');
	await buildClient();
	log("Contract builded successfully", 'g');

	app.use(cors());
	app.use(express.json());
	app.use(requestLogger);

	app.get("/", (req: Request, res: Response) => {
		res.send("OK");
	});

	app.use("/auth", auth);
	app.use("/personalData", personalData);
	// app.use("/exchange", exchange);

	await app.listen(port);
	log(`Server is running on http://localhost:${port}`, 'g');
}