import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { createServer } from "http";
import express from "express";
import basicAuth from "express-basic-auth";
import { MainRoom } from "./rooms/MainRoom";

const PORT = Number(process.env.PORT || 3000);
const auth = basicAuth({ users: { admin: "admin" }, challenge: true });
const app = express();
const server = new Server({ server: createServer(app) });

server.register("main", MainRoom, {});

app.use("/colyseus", auth, monitor(server));

process.on("SIGUSR2", () => process.exit(0));

server.listen(PORT);
