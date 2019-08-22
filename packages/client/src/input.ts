import { PlayerCommandPayload } from "colyseus-test-core";

export interface KeyBindings {
  [keyCode: string]: keyof PlayerCommandPayload;
}

export interface Input {
  command: PlayerCommandPayload;
}

export function createInputListener(keyBindings: KeyBindings): Input {
  const command: PlayerCommandPayload = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    fire: false,
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.repeat) {
      return;
    }

    const binding = keyBindings[e.code];

    if (!binding) {
      return;
    }

    e.preventDefault();

    command[binding] = true;
  }

  function handleKeyup(e: KeyboardEvent) {
    const binding = keyBindings[e.code];

    if (!binding) {
      return;
    }

    e.preventDefault();

    command[binding] = false;
  }

  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);

  return {
    get command() {
      return command;
    },
  };
}
