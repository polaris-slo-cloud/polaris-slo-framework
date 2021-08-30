export interface MetricsAlertGeneratorSchema {
    dashboardId: string;
    panel: string;
    bearerToken?: string;
    grafanaUrl?: string;
    evaluateEvery?: string;
    for?: string;
    when?: string;
    of?: string[];
    threshold?: number;
    directory?: string;
}

export interface MetricsAlertGeneratorSchemaNormalized{
    name: string;
    dashboardId: string;
    panel: string;
    destDir: string;
    bearerToken: string;
    grafanaUrl: string;
    evaluateEvery: string;
    for: string;
    when: string;
    of: string[];
    threshold: number;
    toDisk: boolean;
}
