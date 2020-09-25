
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string): void {
    if (parentModule) {
        throw new Error(`${moduleName} has already been loaded. Import core modules in the AppModule only.`);
    }
}
