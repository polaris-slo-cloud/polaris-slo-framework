import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisualizationMasterComponent } from './visualization-master.component';

describe('VisualizationMasterComponent', () => {
    let component: VisualizationMasterComponent;
    let fixture: ComponentFixture<VisualizationMasterComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [VisualizationMasterComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VisualizationMasterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
