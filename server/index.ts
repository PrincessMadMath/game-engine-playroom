import http from "http";
import express from "express";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";

import { DrinkingGameRoom } from "./DrinkOrPiss";

const port = Number(process.env.PORT || 4321);
const app = express();

const server = http.createServer(app);
const gameServer = new Server({ server });

// register your room handlers
gameServer.register("drink_or_piss", DrinkingGameRoom);

// Register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
