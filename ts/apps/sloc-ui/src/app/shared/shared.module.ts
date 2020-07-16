import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from '@ngx-translate/core';
import { DashboardsListComponent } from './components/dashboards-list/dashboards-list.component';
import { GrafanaPanelHostComponent } from './components/grafana-panel-host/grafana-panel-host.component';
import { PanelsListComponent } from './components/panels-list/panels-list.component';
import { GrafanaPanelEmbedUrlPipe } from './pipes/grafana-panel-embed-url/grafana-panel-embed-url.pipe';

const COMPONENTS: any[] = [
    DashboardsListComponent,
    GrafanaPanelHostComponent,
    PanelsListComponent,
];

const DIRECTIVES: any[] = [
];

const PIPES: any[] = [
    GrafanaPanelEmbedUrlPipe,
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
        TranslateModule,
        ...MATERIAL_IMPORTS,
    ],
    providers: PROVIDERS,
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ...DECLARATIONS,
        ...MATERIAL_IMPORTS,
    ],
})
export class SharedModule { }
