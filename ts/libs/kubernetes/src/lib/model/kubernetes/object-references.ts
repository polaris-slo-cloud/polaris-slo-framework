
export interface ApiVersionKind {
    apiVersion?: string;
    kind: string;
}

export interface CrossVersionObjectReference extends ApiVersionKind {
    name: string;
}
