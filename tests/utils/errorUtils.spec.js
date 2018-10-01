jest.mock('@degjs/scroll-to', () => jest.fn());
import {logError, scrollToError} from '../../src/utils/errorUtils';
import scrollTo from '@degjs/scroll-to';

describe('errorUtils', () => {

    describe('logError', () => {
        global.console = {
            log: jest.fn(),
            error: jest.fn()
        }

        afterEach(() => {
            global.console.log.mockReset();
            global.console.error.mockReset();
        })

        it('should log by default', () => {
            const msg = 'Something went horribly wrong.';
            const expectedMsg = `formValidation: ${msg}`;
            logError(msg);

            expect(global.console.log).toHaveBeenCalled();
            expect(global.console.log).toHaveBeenCalledWith(expectedMsg);
        });

        it('should change log level, if specified', () => {
            const msg = 'Something went horribly wrong.';
            const expectedMsg = `formValidation: ${msg}`;
            logError(msg, null, 'error');

            expect(global.console.error).toHaveBeenCalled();
            expect(global.console.error).toHaveBeenCalledWith(expectedMsg);
        });

        it('should log element if exists', () => {
            const msg = 'Something went horribly wrong.';
            const expectedMsg = `formValidation: ${msg}`;
            const fakeElement = 'fakeElement'
            logError(msg, fakeElement);

            expect(global.console.log).toHaveBeenCalledTimes(2);
            expect(global.console.log).toHaveBeenNthCalledWith(1, expectedMsg);
            expect(global.console.log).toHaveBeenNthCalledWith(2, fakeElement);
        })
    });

    describe('scrollToError', () => {
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should call scrollTo if error el exists', () => {
            scrollToError('fakeEl', 1, 'easeOut');

            expect(scrollTo).toHaveBeenCalled();
        });

        it('should do nothing if no error el', () => {
            scrollToError(null , 1, 'easeOut');

            expect(scrollTo).not.toHaveBeenCalled();
        });
    });
});