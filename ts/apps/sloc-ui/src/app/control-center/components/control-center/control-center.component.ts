import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardDTO } from '../../../common/model';
import { DashboardOperations } from '../../../core';

@Component({
    selector: 'sloc-control-center',
    templateUrl: './control-center.component.html',
    styleUrls: ['./control-center.component.scss'],
})
export class ControlCenterComponent implements OnInit {

    selectedDashboardUid: string;

    selectedDashboard$: Observable<DashboardDTO>;

    constructor(
        private dashboardOps: DashboardOperations,
    ) { }

    ngOnInit(): void {
    }

    onSelectedDashboardChange(): void {
        this.selectedDashboard$ = null;
        if (this.selectedDashboardUid) {
            this.selectedDashboard$ = this.dashboardOps.getDashboardByUid(this.selectedDashboardUid);
        }
    }

}
