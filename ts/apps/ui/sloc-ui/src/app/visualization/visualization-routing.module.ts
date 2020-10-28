import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisualizationMasterComponent } from './components/visualization-master/visualization-master.component';

const routes: Routes = [
    { path: '', component: VisualizationMasterComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VisualizationRoutingModule { }
