import { createRngUtils, random } from "colyseus-test-utils";
import { Texture } from "three";

const { jitter, range } = createRngUtils();
const maxValues = [255, 255, 255];

export function createColor(
  min: number[] = maxValues,
  max: number[] = maxValues,
): string {
  return min
    .map((x, i) => [x, max[i]])
    .reduce((a, [x, y]) => `${a}${Math.floor(range(x, y)).toString(16)}`, "#");
}

type Point = {
  x: number;
  y: number;
  radius: number;
  color: string;
};

const FIELD_SIZE = 2048;

const STAR_COLORS_MIN = [120, 100, 120];
const STAR_COLORS_MAX = [200, 100, 180];
const DUST_COLORS_MIN = [60, 60, 60];
const DUST_COLORS_MAX = [70, 70, 70];

const starColors: string[] = [];
const dustColors: string[] = [];

for (let i = 0; i < 5; i++) {
  const color = createColor(STAR_COLORS_MIN, STAR_COLORS_MAX);

  starColors.push(color);
}

for (let i = 0; i < 5; i++) {
  const color = createColor(DUST_COLORS_MIN, DUST_COLORS_MAX);

  dustColors.push(color);
}

type DrawOp = (context: CanvasRenderingContext2D) => void;

function offscreen(
  draw: DrawOp,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return canvas;
  }

  canvas.width = width;
  canvas.height = height;

  draw(context);

  return canvas;
}

function createParticles(
  n: number,
  colors: string[],
  baseRadius: number,
): Point[] {
  const particles: Point[] = [];

  for (let i = n; i >= 0; i--) {
    const x = range(0, FIELD_SIZE);
    const y = range(0, FIELD_SIZE);
    const radius = Math.floor(jitter(baseRadius) * 100) / 100;
    const color = colors[Math.floor(random() * colors.length)];

    particles.push({ x, y, radius, color });
  }

  return particles;
}

function drawField(
  context: CanvasRenderingContext2D,
  particles: Point[],
  arcLimit: number = 1.1,
): void {
  for (let i = 0; i < particles.length; i++) {
    const { x, y, radius, color } = particles[i];

    context.fillStyle = color;
    context.beginPath();

    if (radius <= arcLimit) {
      context.fillRect(x, y, 1, 1);
    } else {
      context.arc(x, y, radius, 0, Math.PI * 2);
    }

    context.fill();
  }
}

export function createStarFieldTexture(count: number) {
  const particles = createParticles(count, starColors, 1);
  const canvas = offscreen(
    context => drawField(context, particles),
    FIELD_SIZE,
    FIELD_SIZE,
  );

  const texture = new Texture(canvas);

  texture.needsUpdate = true;

  return texture;
}

export function createDustFieldTexture(count: number) {
  const particles = createParticles(count, dustColors, 2);
  const canvas = offscreen(
    context => drawField(context, particles),
    FIELD_SIZE,
    FIELD_SIZE,
  );

  const texture = new Texture(canvas);

  texture.needsUpdate = true;

  return texture;
}
