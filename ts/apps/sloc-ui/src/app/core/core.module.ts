import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from '../common';
import { SharedModule } from '../shared/shared.module';

const PROVIDERS: any[] = [
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
