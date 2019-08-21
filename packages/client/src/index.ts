import { Client } from "colyseus.js";

// @ts-ignore
const client = new Client(`ws://${window.APP_CONFIGURATION.SERVER_URL}`);
const room = client.join("main");

room.onStateChange.add((state: any) => {});
