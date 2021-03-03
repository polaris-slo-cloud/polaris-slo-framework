import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';

// ToDo
describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [AppComponent],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

});
