import { Entity } from "colyseus-test-core";

export function detect<A, B>(
  predicateA: (entity: any) => entity is A,
  predicateB: (entity: any) => entity is B,
  entityA: Entity,
  entityB: Entity,
  callback: (a: A, b: B) => void,
) {
  let a: A;
  let b: B;

  if (predicateA(entityA) && predicateB(entityB)) {
    a = entityA;
    b = entityB;
  } else if (predicateA(entityB) && predicateB(entityA)) {
    a = entityB;
    b = entityA;
  }

  if (a && b) {
    callback(a, b);
  }
}
