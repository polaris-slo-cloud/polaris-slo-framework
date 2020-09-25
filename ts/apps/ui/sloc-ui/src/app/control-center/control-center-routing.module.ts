import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlCenterComponent } from './components/control-center/control-center.component';

const routes: Routes = [
    { path: '', component: ControlCenterComponent },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})
export class ControlCenterRoutingModule { }
