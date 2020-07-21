import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '../app-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AppComponent } from './app.component';
import { NavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { NavigationComponent } from './components/navigation/navigation.component';

const PROVIDERS: any[] = [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
];

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        NavigationItemComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        BrowserAnimationsModule,
        SharedModule,
    ],
    providers: PROVIDERS,
    bootstrap: [ AppComponent ],
})
export class AppModule { }
