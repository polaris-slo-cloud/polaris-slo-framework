import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { GrafanaPanelHostComponent } from './grafana-panel-host.component';

// ToDo
describe('GrafanaPanelHostComponent', () => {
    let component: GrafanaPanelHostComponent;
    let fixture: ComponentFixture<GrafanaPanelHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GrafanaPanelHostComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GrafanaPanelHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
