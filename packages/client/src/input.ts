import { PlayerInputs } from "@warbird/core";

export interface KeyBindings {
  [keyCode: string]: keyof PlayerInputs;
}

type InputSubscriber = <K extends keyof PlayerInputs>(
  key: K,
  value: PlayerInputs[K],
) => any;

export function createInputListener(keyBindings: KeyBindings) {
  const subscribers = new Set<InputSubscriber>();
  const command: PlayerInputs = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    activateWeapon: false,
  };

  function update<K extends keyof PlayerInputs>(
    key: K,
    value: PlayerInputs[K],
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
      subscribers.add(subscriber);
    },
    unsubscribe: (subscriber: InputSubscriber) => {
      subscribers.delete(subscriber);
    },
  };
}
