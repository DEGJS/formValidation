jest.mock('@degjs/dom-utils', () => ({
    emptyElements: jest.fn(),
    isElement: jest.fn(o => o.type === 'element')
}));
jest.mock('@degjs/object-utils', () => ({
    ensureArray: jest.fn(item => item)
}));

jest.mock('../src/utils/state.js');
jest.mock('../src/utils/idUtils', () => ({
    getUniqueId: jest.fn()
}));
jest.mock('../src/utils/formUtils', () => ({
    checkFormIntegrity: jest.fn(),
    checkFieldIntegrity: jest.fn(),
    checkRuleIntegrity: jest.fn(),
    disableBrowserValidation: jest.fn()
}));
jest.mock('../src/utils/errorUtils', () => ({
    logError: jest.fn(),
    scrollToError: jest.fn()
}));

jest.mock('../src/renderers/renderers', () => ({
    renderErrorsEl: jest.fn(),
    renderValidationMessage: jest.fn()
}));

import formValidation from '../src/formValidation';
import formUtils from '../src/utils/formUtils';
import idUtils from '../src/utils/idUtils';
import state from '../src/utils/state';
import {emptyElements} from '@degjs/dom-utils';

describe('formValidation', () => {
    let formEl;
    let stateInst;

    beforeEach(() => {
        formEl = document.createElement('form');
        const fieldEl = document.createElement('div');
        fieldEl.classList.add('js-validation-field');
        const inputEl = document.createElement('input');
        
        fieldEl.appendChild(inputEl);
        formEl.appendChild(fieldEl);

        stateInst = state();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('init', () => {
       
        it('should checkFormIntegrity', () => {
            formValidation(formEl, {});
            expect(formUtils.checkFormIntegrity).toHaveBeenCalled();
        });

        it('should disable browser validation', () => {
            formValidation(formEl, {});
            expect(formUtils.disableBrowserValidation).toHaveBeenCalled();
        });

        describe('registerFields', () => {

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should generate unique id', () => {
                formValidation(formEl, {});
                expect(idUtils.getUniqueId).toHaveBeenCalled();
            });

            it('should check field integrity', () => {
                formValidation(formEl, {});
                expect(formUtils.checkFieldIntegrity).toHaveBeenCalled();
            });

            it('should add field', () => {
                formValidation(formEl, {});
                expect(stateInst.addField).toHaveBeenCalled();
            });

            it('should add field vals', () => {
                formValidation(formEl, {});
                expect(stateInst.addFieldVals).toHaveBeenCalled();
            });

            it('should register rules', () => {
                formValidation(formEl, {
                    rules: [
                        { 
                            isRelevant: () => true,
                            settings: { events: [] }
                        }
                    ]
                });
                expect(formUtils.checkRuleIntegrity).toHaveBeenCalled();
            });
        });
    });

    describe('removeFields', () => {
        it('should remove if id provided', () => {
            const id = 'id1';
            const fvInst = formValidation(formEl, {});
            fvInst.removeFields([id]);
            expect(stateInst.removeField).toHaveBeenCalled();
            expect(stateInst.removeField).toHaveBeenCalledWith(id);
        });

        it('should remove if element provided', () => {
            const id = 'id1';
            const mockEl = {
                type: 'element',
                querySelector: () => null,
                getAttribute: () => id
            };

            const fvInst = formValidation(formEl, {});
            fvInst.removeFields([mockEl]);
            expect(stateInst.removeField).toHaveBeenCalled();
            expect(stateInst.removeField).toHaveBeenCalledWith(id);
        });

        it('should empty error msg el', () => {
            const id = 'id1';
            const mockErrorMsgEl = {
                classList: {
                    contains: () => false
                }
            }
            const mockEl = {
                type: 'element',
                querySelector: () => mockErrorMsgEl,
                getAttribute: () => id
            };

            const fvInst = formValidation(formEl, {});
            fvInst.removeFields([mockEl]);
            expect(stateInst.removeField).toHaveBeenCalled();
            expect(stateInst.removeField).toHaveBeenCalledWith(id);
        });
    });

    it('reset', () => {
        const fvInst = formValidation(formEl, {});
        fvInst.reset();
        expect(emptyElements).toHaveBeenCalled();
    })
});