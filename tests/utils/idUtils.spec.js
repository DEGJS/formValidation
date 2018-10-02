import {getUniqueId, generateId} from '../../src/utils/idUtils';

describe('idUtils', () => {
    describe('generateId', () => {
        it('should return a string', () => {
            expect(typeof generateId()).toBe('string');
        });

        it('should prefix num, if provided', () => {
            const expectedPrefix = 'prefix-';
            const output = generateId(expectedPrefix);
            expect(output.substring(0,7)).toEqual(expectedPrefix);
        });
    });

    describe('getUniqueId', () => {
        it('should return id if it exists', () => {
            const mockId = 'mock-id-1';
            const el = {
                getAttribute: () => mockId
            };

            expect(getUniqueId(el, {})).toEqual(mockId);
        });

        it('should generate an id and set it, if none exists', () => {
            const el = {
                getAttribute: () => '',
                setAttribute: jest.fn((attrName, attrVal) => attrVal)
            };
            const expectedAttrName = 'id';
            const expectedId = getUniqueId(el, {});
            expect(el.setAttribute).toHaveBeenCalled();
            expect(el.setAttribute).toHaveBeenCalledWith(expectedAttrName, expectedId);
        });
    });
});