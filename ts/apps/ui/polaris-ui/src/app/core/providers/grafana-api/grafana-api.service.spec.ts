import { TestBed } from '@angular/core/testing';

import { GrafanaApiService } from './grafana-api.service';

// ToDo
describe('GrafanaApiService', () => {
    let service: GrafanaApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GrafanaApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
