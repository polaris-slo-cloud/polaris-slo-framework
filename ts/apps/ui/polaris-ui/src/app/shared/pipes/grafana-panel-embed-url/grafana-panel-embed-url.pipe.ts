import { Inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CONFIG } from '../../../common';
import { GRAFANA_BASE_URL } from '../../../core';

export interface PanelIdentifier {
    dashboardUid: string;
    panelId: number;
}

@Pipe({
    name: 'slocGrafanaPanelEmbedUrl',
})
export class GrafanaPanelEmbedUrlPipe implements PipeTransform {

    constructor(
        @Inject(GRAFANA_BASE_URL) private grafanaBaseUrl: string,
        private sanitizer: DomSanitizer,
    ) { }

    transform(value: PanelIdentifier): SafeResourceUrl {
        if (!value || !value.dashboardUid || typeof value.panelId !== 'number') {
            return '';
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `${CONFIG.grafanaEmbeddingBaseUrl}/d-solo/${value.dashboardUid}?refresh=5s&panelId=${value.panelId}`,
        );
    }

}
