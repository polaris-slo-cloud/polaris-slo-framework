
export type Index<K extends string | number, V> = {
    [P in K]: V;
}

export interface IndexByKey<V> {
    [name: string]: V;
}

export interface IndexById<V> {
    [id: number]: V;
}

export type Constructor<T> = new(...args: any[]) => T

export type ClassDecoratorFn = (target: Constructor<any>) => void;

export type InterfaceOf<T> = { [K in keyof T]: T[K]; };
