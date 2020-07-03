import { GrafanaPanelEmbedUrlPipe } from './grafana-panel-embed-url.pipe';

describe('GrafanaPanelEmbedUrlPipe', () => {
    it('create an instance', () => {
        const pipe = new GrafanaPanelEmbedUrlPipe();
        expect(pipe).toBeTruthy();
    });
});
