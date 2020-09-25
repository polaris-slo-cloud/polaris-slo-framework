import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PanelIdentifier } from '../../pipes';

@Component({
    selector: 'sloc-grafana-panel-host',
    templateUrl: './grafana-panel-host.component.html',
    styleUrls: ['./grafana-panel-host.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrafanaPanelHostComponent implements OnInit {

    @Input()
    panelIdentifier: PanelIdentifier;

    constructor() { }

    ngOnInit(): void {
    }

}
