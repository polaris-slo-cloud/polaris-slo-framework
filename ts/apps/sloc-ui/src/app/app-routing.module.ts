import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [

];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES),
    ],
    exports: [ RouterModule ],
})
export class AppRoutingModule { }
