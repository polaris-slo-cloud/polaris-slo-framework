import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { VisualizationMasterComponent } from './components/visualization-master/visualization-master.component';
import { VisualizationRoutingModule } from './visualization-routing.module';


@NgModule({
    declarations: [
        VisualizationMasterComponent,
    ],
    imports: [
        SharedModule,
        VisualizationRoutingModule,
    ],
})
export class VisualizationModule { }
