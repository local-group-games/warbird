import seedrandom from "seedrandom";

export const clamp = (x: number, min: number, max: number) =>
  Math.min(max, Math.max(x, min));

export const random = seedrandom("daisy");

export function createRngUtils(rng: () => number = random) {
  const bool = (): boolean => rng() >= 0.5;
  const sign = (n: number): number => (bool() ? n : n * -1);
  const jitter = (x: number): number => (rng() + 0.5) * x;
  const range = (min: number = 0, max: number = 1): number =>
    clamp(rng() * max, min, max);

  return {
    bool,
    sign,
    jitter,
    range,
  };
}
