import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterComponent } from './control-center.component';

describe('ControlCenterComponent', () => {
    let component: ControlCenterComponent;
    let fixture: ComponentFixture<ControlCenterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ControlCenterComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlCenterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
