import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';

import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DashboardDTO } from '../../../common';
import { DashboardOperations } from '../../../core';
import { PanelIdentifier } from '../../../shared';

@Component({
    selector: 'sloc-visualization-master',
    templateUrl: './visualization-master.component.html',
    styleUrls: ['./visualization-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizationMasterComponent implements OnInit {

    panelForm: FormGroup;
    selectedDashboard$: Observable<DashboardDTO>;

    constructor(
        private dashboardOps: DashboardOperations,
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.panelForm = new FormGroup({
            dashboardUid: new FormControl(null, Validators.required),
            panelId: new FormControl(null, Validators.required),
        });

        this.selectedDashboard$ = this.panelForm.valueChanges.pipe(
            map((value: PanelIdentifier) => value.dashboardUid),
            distinctUntilChanged(),
            switchMap(dashboardUid => {
                this.panelForm.patchValue({ panelId: null });
                if (dashboardUid) {
                    return this.dashboardOps.getDashboardByUid(dashboardUid);
                } else {
                    return observableOf(null);
                }
            }),
        );
    }

}
