import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('./control-center/control-center.module').then(m => m.ControlCenterModule),
     },
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES),
    ],
    exports: [ RouterModule ],
})
export class AppRoutingModule { }
