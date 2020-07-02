import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { DashboardsListComponent } from './components/dashboards-list/dashboards-list.component';

const COMPONENTS: any[] = [
    DashboardsListComponent,
];

const DIRECTIVES: any[] = [
];

const PIPES: any[] = [
];

const DECLARATIONS: any[] = [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
];

const PROVIDERS: any[] = [
];

const MATERIAL_IMPORTS: any[] = [
    MatListModule,
    MatSelectModule,
];

@NgModule({
    declarations: DECLARATIONS,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...MATERIAL_IMPORTS,
    ],
    providers: PROVIDERS,
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...DECLARATIONS,
        ...MATERIAL_IMPORTS,
    ],
})
export class SharedModule { }
