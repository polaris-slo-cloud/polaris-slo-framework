import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PanelIdentifier } from '../../pipes';

@Component({
    selector: 'polaris-grafana-panel-host',
    templateUrl: './grafana-panel-host.component.html',
    styleUrls: ['./grafana-panel-host.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrafanaPanelHostComponent {

    @Input()
    panelIdentifier: PanelIdentifier;

    constructor() { }

}
