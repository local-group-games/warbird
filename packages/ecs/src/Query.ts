import { Component } from "./Component";
import { Entity } from "./Entity";
import { Constructor, ComponentConstructor } from "./types";

export type Query<C extends QueryConfig = QueryConfig> = {
  [K in keyof C]: Constructor<C[K]>[];
};

export type QueryConfig = {
  [key: string]: Component;
};

export type QueryResult<Q extends Query = Query> = {
  [K in keyof Q]: Q[K] extends ComponentConstructor<infer C>[]
    ? Entity<C>[]
    : never;
};
