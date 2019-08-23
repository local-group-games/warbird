import { PlayerCommandPayload } from "colyseus-test-core";

export interface KeyBindings {
  [keyCode: string]: keyof PlayerCommandPayload;
}

type InputSubscriber = <K extends keyof PlayerCommandPayload>(
  key: K,
  value: PlayerCommandPayload[K],
) => any;

export function createInputListener(keyBindings: KeyBindings) {
  const subscribers: InputSubscriber[] = [];
  const command: PlayerCommandPayload = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    fire: false,
  };

  function update<K extends keyof PlayerCommandPayload>(
    key: K,
    value: PlayerCommandPayload[K],
  ) {
    for (const subscriber of subscribers) {
      subscriber(key, value);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.repeat) {
      return;
    }

    const binding = keyBindings[e.code];

    if (!binding) {
      return;
    }

    e.preventDefault();

    if (!command[binding]) {
      command[binding] = true;
      update(binding, true);
    }
  }

  function handleKeyup(e: KeyboardEvent) {
    const binding = keyBindings[e.code];

    if (!binding) {
      return;
    }

    e.preventDefault();

    command[binding] = false;
    update(binding, false);
  }

  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);

  return {
    subscribe: (subscriber: InputSubscriber) => {
      subscribers.push(subscriber);
    },
  };
}
