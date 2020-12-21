
/**
 * Captures the configuration necessary for connecting to a Prometheus DB.
 */
export interface PrometheusConfig {

    /**
     * Determines whether to use an HTTPS connection.
     *
     * Default: `false`
     */
    useTLS?: boolean;

    /**
     * The host, where Prometheus can be reached.
     */
    host: string;

    /**
     * The port, where Prometheus is listening.
     *
     * Default: `9090`
     */
    port?: number;

    /**
     * The base URL of the Prometheus REST API.
     *
     * Default: `/api/v1`
     */
    baseURL?: string;

    /**
     * Credentials to be used for authentication.
     */
    auth?: {
        username: string,
        password: string,
    }

    /**
     * Number of milliseconds before a request goes into timeout.
     */
    timeout?: number;


}
