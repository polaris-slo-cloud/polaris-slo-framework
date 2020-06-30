import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const COMPONENTS: any[] = [
];

const ENTRY_COMPONENTS: any[] = [
];

const DIRECTIVES: any[] = [
];

const PIPES: any[] = [
];

const DECLARATIONS: any[] = [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
];

const PROVIDERS: any[] = [
];

@NgModule({
    declarations: DECLARATIONS,
    entryComponents: ENTRY_COMPONENTS,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: PROVIDERS,
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...DECLARATIONS,
    ],
})
export class SharedModule { }
