import { SimpleChange } from '@angular/core';

export type Index<K extends string | number, V> = {
    [P in K]: V;
}

export interface IndexByKey<V> {
    [name: string]: V;
}

export interface IndexById<V> {
    [id: number]: V;
}

/**
 * The type of the changes object that is passed to `ngOnChanges()`.
 */
export type ChangesOf<T> = { [K in keyof T]?: SimpleChange };
