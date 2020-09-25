import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PanelsListComponent } from './panels-list.component';

// ToDo
describe('PanelsListComponent', () => {
    let component: PanelsListComponent;
    let fixture: ComponentFixture<PanelsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PanelsListComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PanelsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
