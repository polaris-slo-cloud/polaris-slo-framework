import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ControlCenterComponent } from './components/control-center/control-center.component';
import { ControlCenterRoutingModule } from './control-center-routing.module';


@NgModule({
    declarations: [
        ControlCenterComponent,
    ],
    imports: [
        SharedModule,
        ControlCenterRoutingModule,
    ],
})
export class ControlCenterModule { }
