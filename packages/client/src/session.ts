import { Room } from "colyseus.js";

export type Session = {
  roomId: string;
  sessionId: string;
};

const SESSION_KEY = "warbird/session";

export function cacheSession(room: Room) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ roomId: room.id, sessionId: room.sessionId }),
  );
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as Session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
