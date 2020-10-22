import { Subscribable } from 'rxjs';

/**
 * Convenience type for a map object.
 */
export type Index<K extends string | number, V> = {
    [P in K]: V;
}

/**
 * Convenience type for a map object with string keys.
 */
export interface IndexByKey<V> {
    [name: string]: V;
}

/**
 * Convenience type for a map object with numeric keys.
 */
export interface IndexById<V> {
    [id: number]: V;
}

/**
 * A class or constructor function that creates an instance of `T`.
 */
export type Constructor<T> = new(...args: any[]) => T

/**
 * A class of type `T` that has the static properties defined in `P`.
 */
export type ConstructorWithStaticProperties<T, P> = (new(...args: any[]) => T) & P

export type ClassDecoratorFn = (target: Constructor<any>) => void;

/**
 * Used to describe an interface that has the same properties and methods as a class.
 */
export type InterfaceOf<T> = { [K in keyof T]: T[K]; };

/**
 * A function that returns a class/constructor.
 */
export type TypeFn<T> = () => Constructor<T>;

/**
 * Convenience type used for describing a key-value pair.
 */
export interface KeyValuePair<K, V> {
    key: K;
    value: V;
}

/**
 * Convenience type to indicate that something may have an interface like an `Observable` or like a `Promise`.
 */
export type ObservableOrPromise<T> = Subscribable<T> | PromiseLike<T>;
