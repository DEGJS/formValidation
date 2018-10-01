jest.mock('../../src/utils/errorUtils', () => ({
    logError: jest.fn()
}));
import {
    checkFormIntegrity,
    checkFieldIntegrity,
    checkRuleIntegrity,
    disableBrowserValidation
} from '../../src/utils/formUtils';
import errorUtils from '../../src/utils/errorUtils';

describe('formUtils', () => {
    afterEach(() => {
        errorUtils.logError.mockReset();
    });

    it('should disable native browser validation', () => {
        const formEl = {
            setAttribute: jest.fn()
        };

        disableBrowserValidation(formEl);

        expect(formEl.setAttribute).toHaveBeenCalled();
        expect(formEl.setAttribute).toHaveBeenCalledWith('novalidate', 'novalidate');
    });

    describe('checkFormIntegrity', () => {
        it('should error if no form el', () => {
            checkFormIntegrity(null, {});
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith('Form element not defined.');
        });

        it('should error if el is not a form', () => {
            const mockEl = {
                tagName: 'DIV'
            }
            checkFormIntegrity(mockEl, {});
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith('Form element not defined.');
        });

        it('should error if no rules', () => {
            const mockEl = {
                tagName: 'FORM'
            }
            const mockSettings = {
                rules: []
            }
            checkFormIntegrity(mockEl, mockSettings);
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith('No rules set.');
        });
    });

    describe('checkFieldIntegrity', () => {
        it('should error if no inputEls not defined', () => {
            checkFieldIntegrity(null, null);
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith('No input elements (input, select or textarea) found within field element.', null);
        });

        it('should error if inputEls array is empty', () => {
            checkFieldIntegrity(null, []);
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith('No input elements (input, select or textarea) found within field element.', null);
        });

        it('should not error if inputEls exists', () => {
            checkFieldIntegrity(null, ['test']);
            expect(errorUtils.logError).not.toHaveBeenCalled();
        });

        it('should not error if input els is an array of objects', () => {
            checkFieldIntegrity(null, ['test']);
            expect(errorUtils.logError).not.toHaveBeenCalled();
        });
    });

    describe('checkRuleIntegrity', () => {
        it('should error if rule is missing settings', () => {
            const expectedErrorMsg = 'The rule "mockRule" does not return a settings object, and will not work properly.'
            checkRuleIntegrity({}, 'mockRule');
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith(expectedErrorMsg);
        });

        it('should error if rule is not configured for events', () => {
            const expectedErrorMsg = 'The rule "mockRule" does not contain any events in its settings object, and will not work properly.'
            const mockRule = {
                settings: {
                    events: []
                }
            };
            checkRuleIntegrity(mockRule, 'mockRule');
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith(expectedErrorMsg);
        });

        it('should error if rule is not configured with message attribute', () => {
            const expectedErrorMsg = 'The rule "mockRule" is missing the "messageAttr" property in its settings object, and will not work properly.'
            const mockRule = {
                settings: {
                    events: ['submit']
                }
            };
            checkRuleIntegrity(mockRule, 'mockRule');
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith(expectedErrorMsg);
        });

        it('should error if rule is not configured with isRelevant setting', () => {
            const expectedErrorMsg = 'The rule "mockRule" does not return an isRelevant method, and will not work properly.'
            const mockRule = {
                settings: {
                    events: ['submit'],
                    messageAttr: 'data-mock-rule'
                }
            };
            checkRuleIntegrity(mockRule, 'mockRule');
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith(expectedErrorMsg);
        });

        it ('should error if rule is not configured with validate method', () => {
            const expectedErrorMsg = 'The rule "mockRule" does not return a validate method, and will not work properly.'
            const mockRule = {
                settings: {
                    events: ['submit'],
                    messageAttr: 'data-mock-rule'
                },
                isRelevant: 'isRelevant'
            };
            checkRuleIntegrity(mockRule, 'mockRule');
            expect(errorUtils.logError).toHaveBeenCalled();
            expect(errorUtils.logError).toHaveBeenCalledWith(expectedErrorMsg);
        });
    });

})