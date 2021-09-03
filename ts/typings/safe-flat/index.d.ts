
declare module 'safe-flat' {
    function flatten(obj: any, delimiter?: string): Record<string, any>;
    function unflatten(flatObj: Record<string, any>, delimiter?: string): any;
}
