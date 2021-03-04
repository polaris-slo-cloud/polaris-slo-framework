import { TimeSeriesSource } from '../../public';
import { MetricsSourcesManager } from '../../public/metrics-source';

export class DefaultMetricsSourcesManager implements MetricsSourcesManager {

    private timeSeriesSources: Map<string, TimeSeriesSource> = new Map();
    private defaultTimeSeriesSource: TimeSeriesSource;

    addTimeSeriesSource(source: TimeSeriesSource, setAsDefault: boolean = false): void {
        this.timeSeriesSources.set(source.name, source);
        if (setAsDefault) {
            this.setDefaultTimeSeriesSource(source.name);
        }
    }

    setDefaultTimeSeriesSource(name: string): TimeSeriesSource {
        this.defaultTimeSeriesSource = this.timeSeriesSources.get(name);
        return this.defaultTimeSeriesSource;
    }

    getTimeSeriesSource(name?: string): TimeSeriesSource {
        if (name) {
            return this.timeSeriesSources.get(name);
        } else {
            return this.defaultTimeSeriesSource;
        }
    }

}
