import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NavigationItemComponent } from './navigation-item.component';

// ToDo
describe('NavigationItemComponent', () => {
    let component: NavigationItemComponent;
    let fixture: ComponentFixture<NavigationItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavigationItemComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
