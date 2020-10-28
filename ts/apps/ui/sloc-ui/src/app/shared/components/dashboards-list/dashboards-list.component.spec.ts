import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { DashboardsListComponent } from './dashboards-list.component';

// ToDo
describe('DashboardsListComponent', () => {
    let component: DashboardsListComponent;
    let fixture: ComponentFixture<DashboardsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardsListComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
