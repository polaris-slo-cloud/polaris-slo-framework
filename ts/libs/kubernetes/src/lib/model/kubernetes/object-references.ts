
export interface ApiVersionKind {
    apiVersion?: string;
    kind: string;
}

export interface ObjectReference extends ApiVersionKind {
    name: string;
}
