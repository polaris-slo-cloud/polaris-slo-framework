import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

const PROVIDERS: any[] = [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
    ],
    providers: PROVIDERS,
    bootstrap: [ AppComponent ],
})
export class AppModule { }
