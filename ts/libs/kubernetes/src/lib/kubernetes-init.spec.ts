import { kubernetes } from './kubernetes';

describe('kubernetes', () => {
    it('should work', () => {
        expect(kubernetes()).toEqual('kubernetes');
    });
});
