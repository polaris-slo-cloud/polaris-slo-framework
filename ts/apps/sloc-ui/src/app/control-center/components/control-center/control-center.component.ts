import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DashboardDTO } from '../../../common/model';
import { DashboardOperations } from '../../../core';
import { PanelIdentifier } from '../../../shared';

@Component({
    selector: 'sloc-control-center',
    templateUrl: './control-center.component.html',
    styleUrls: ['./control-center.component.scss'],
})
export class ControlCenterComponent implements OnInit {

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
