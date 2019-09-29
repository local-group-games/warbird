import { Component } from "./Component";

export type Constructor<T> = new (...args: any[]) => T;
export type ComponentConstructor<C extends Component> = Constructor<C>;
