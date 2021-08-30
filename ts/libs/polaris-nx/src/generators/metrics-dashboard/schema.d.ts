export interface GrafanaDashboardGeneratorSchema {
    name: string;
    asRate?: boolean;
    panelType?: string;
    refresh?: string;
    dashboard?: string;
    tags?: string;
    grafanaUrl?: string;
    bearerToken?: string;
    directory?: string;
}

export interface GrafanaDashboardGeneratorNormalizedSchema {
    name: string;

    /** The type of the generated panel **/
    panelType: string;

    /** The destination path for the generated dashboard relative to the current folder. **/
    destDir: string;

    /** The refresh interval of the dashboard **/
    refresh: string;

    /** Parsed tags, will be assigned to the generated dashboard **/
    parsedTags: string[];

    /** Datasource to connect the dashboard with **/
    datasource: string;

    /** Display metric as rate with 5m **/
    asRate: boolean;

    /** Grafana URL - may be empty string - check if toJson is true or false! **/
    grafanaUrl: string;

    /** Grafana API token - may be empty string - check if toJson is true or false! **/
    bearerToken: string;

    /** Signals whether to export dashboard to JSON or call the Grafana REST API **/
    toDisk: boolean;
}

