import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from '../common';
import { CONFIG } from '../common/config/config';
import { SharedModule } from '../shared/shared.module';
import { GrafanaApiService, GRAFANA_BASE_URL, HttpService } from './providers';
import { DashboardOperations } from './providers/operations/dashboard/dashboard.operations';

const PROVIDERS: any[] = [
    { provide: GRAFANA_BASE_URL, useValue: CONFIG.grafanaBaseUrl },

    HttpService,
    GrafanaApiService,
    DashboardOperations,
];

@NgModule({
    declarations: [],
    imports: [
        SharedModule,
        HttpClientModule,
    ],
    exports: [
        SharedModule,
    ],
    providers: PROVIDERS,
})
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule ) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

}
