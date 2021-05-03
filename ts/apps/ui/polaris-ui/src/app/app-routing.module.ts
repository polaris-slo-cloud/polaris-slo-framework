import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
    {
        path: 'control-center',
        loadChildren: () => import('./control-center/control-center.module').then(m => m.ControlCenterModule),
    },
    {
        path: 'visualization',
        loadChildren: () => import('./visualization/visualization.module').then(m => m.VisualizationModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'control-center',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' }),
    ],
    exports: [ RouterModule ],
})
export class AppRoutingModule { }
