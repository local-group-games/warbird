import { monitor } from "@colyseus/monitor";
import { Server } from "colyseus";
import express from "express";
import basicAuth from "express-basic-auth";
import cors from "cors";
import { createServer } from "http";
import { MainRoom } from "./rooms/MainRoom";

const PORT = Number(process.env.PORT || 3001);

const auth = basicAuth({ users: { admin: "admin" }, challenge: true });
const app = express();

app.use(cors());
app.use(express.json());

const server = new Server({
  server: createServer(app),
  express: app,
});

server.define("main", MainRoom);

app.use("/colyseus", auth, monitor(server));

process.on("SIGUSR2", () => process.exit(0));

server.listen(PORT);
