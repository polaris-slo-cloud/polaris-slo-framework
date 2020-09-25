import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { OnChangeFn, OnTouchedFn } from '../../../common';
import { DashboardDTO } from '../../../common/model';

@Component({
    selector: 'sloc-panels-list',
    templateUrl: './panels-list.component.html',
    styleUrls: ['./panels-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PanelsListComponent),
            multi: true,
        },
    ],
})
export class PanelsListComponent implements ControlValueAccessor {

    @Input()
    dashboard: DashboardDTO;

    @Input()
    disabled = false;

    selectedPanelId: number;

    private onChangeFn: OnChangeFn<number>;
    private onTouchedFn: OnTouchedFn;

    writeValue(selectedPanelId: string): void {
        if (typeof selectedPanelId === 'number') {
            this.selectedPanelId = selectedPanelId;
        }
    }

    registerOnChange(fn: OnChangeFn<number>): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: OnTouchedFn): void {
        this.onTouchedFn = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onPanelSelectionChange(change: MatSelectChange): void {
        if (this.onChangeFn) {
            this.onChangeFn(change.value);
        }
    }

}
