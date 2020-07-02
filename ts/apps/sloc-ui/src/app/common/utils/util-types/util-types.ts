import { SimpleChange } from '@angular/core';

/**
 * The type of the changes object that is passed to `ngOnChanges()`.
 */
export type ChangesOf<T> = { [K in keyof T]?: SimpleChange };
