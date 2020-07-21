import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'sloc-visualization-master',
    templateUrl: './visualization-master.component.html',
    styleUrls: ['./visualization-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizationMasterComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
