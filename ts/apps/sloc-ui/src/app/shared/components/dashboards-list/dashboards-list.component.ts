import { ChangeDetectionStrategy, Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ChangesOf } from '../../../common';
import { Observable } from 'rxjs';
import { DashboardSearchHit, SearchRequestOptions } from '../../../common/model';
import { DashboardOperations } from '../../../core';

@Component({
    selector: 'sloc-dashboards-list',
    templateUrl: './dashboards-list.component.html',
    styleUrls: ['./dashboards-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsListComponent implements OnInit, OnChanges {

    /** The tags that the dashboards need to have. */
    @Input()
    tags: string[];

    dashboards$: Observable<DashboardSearchHit[]>;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private dashboardOps: DashboardOperations,
    ) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: ChangesOf<this>): void {
        if (changes.tags) {
            this.searchForDashboards();
        }
    }

    private searchForDashboards(): void {
        this.dashboards$ = this.dashboardOps.searchDashboards({ tag: this.tags });
        this.changeDetector.markForCheck();
    }

}
