import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sloc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    constructor(
        private translateService: TranslateService,
    ) {
        translateService.setDefaultLang('en');
        translateService.use('en');
    }

}
