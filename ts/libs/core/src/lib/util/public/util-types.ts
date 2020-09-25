
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
