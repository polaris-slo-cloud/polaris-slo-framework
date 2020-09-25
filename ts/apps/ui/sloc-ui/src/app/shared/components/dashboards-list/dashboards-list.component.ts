import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { ChangesOf, OnChangeFn, OnTouchedFn } from '../../../common';
import { DashboardSearchHit } from '../../../common/model';
import { DashboardOperations } from '../../../core';

@Component({
    selector: 'sloc-dashboards-list',
    templateUrl: './dashboards-list.component.html',
    styleUrls: ['./dashboards-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DashboardsListComponent),
            multi: true,
        },
    ],
})
export class DashboardsListComponent implements OnInit, OnChanges, ControlValueAccessor {

    /** The tags that the dashboards need to have. */
    @Input()
    tags: string[];

    @Input()
    disabled = false;

    dashboards$: Observable<DashboardSearchHit[]>;

    selectedUid: string;

    private onChangeFn: OnChangeFn<string>;
    private onTouchedFn: OnTouchedFn;

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

    writeValue(selectedUid: string): void {
        if (typeof selectedUid === 'string') {
            this.selectedUid = selectedUid;
            this.changeDetector.markForCheck();
        }
    }

    registerOnChange(fn: OnChangeFn<string>): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: OnTouchedFn): void {
        this.onTouchedFn = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.changeDetector.markForCheck();
    }

    onDashboardSelectionChange(change: MatSelectChange): void {
        if (this.onChangeFn) {
            this.onChangeFn(change.value);
        }
    }

    private searchForDashboards(): void {
        this.dashboards$ = this.dashboardOps.searchDashboards({ tag: this.tags });
        this.changeDetector.markForCheck();
    }

}
