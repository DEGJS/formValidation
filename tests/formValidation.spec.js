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
import errorUtils from '../src/utils/errorUtils';
import state from '../src/utils/state';
import {emptyElements} from '@degjs/dom-utils';

describe('formValidation', () => {
    let formEl;
    let stateInst;
    let fieldEl;

    beforeEach(() => {
        formEl = document.createElement('form');
        fieldEl = document.createElement('div');
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

    it('resets when invoked', () => {
        const fvInst = formValidation(formEl, {});
        fvInst.reset();
        expect(emptyElements).toHaveBeenCalled();
    });

    describe('onEvent', () => {
        const mockSettings = {
            rules: [
                { 
                    isRelevant: () => true,
                    settings: { events: ['testEvent'] }
                }
            ],
            onFieldValidationStart: jest.fn(),
            onFieldValidationSuccess: jest.fn(),
            onFieldValidationError: jest.fn(),
            onFormValidationStart: jest.fn(),
            onFormValidationSuccess: jest.fn(),
            onFormValidationError: jest.fn()
        };

        describe('run field rules', () => {

            beforeEach(() => {
                jest.restoreAllMocks();
            })

            it('should call onFieldValidationStart',  () => {
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                formEl.dispatchEvent(event);

                expect(mockSettings.onFieldValidationStart).toHaveBeenCalled();
            });

            it('should call onFieldValidationStart for multiple fields', () => {
                formEl.appendChild(fieldEl);
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                formEl.dispatchEvent(event);

                expect(mockSettings.onFieldValidationStart).toHaveBeenCalledTimes(2);
            })

            it('should call onFieldValidationSuccess', async () => {
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                await formEl.dispatchEvent(event);

                expect(mockSettings.onFieldValidationSuccess).toHaveBeenCalled();
            });

            it('should call onFieldValidationError', async () => {
                const mockState = [
                    {
                        fieldEl : {
                            classList: {
                                remove: () => true,
                                add: () => true
                            }
                        },
                        rules: [
                            {
                                settings: {events: ['testEvent']},
                                validate: () => {
                                    return new Promise((resolve, reject) => resolve({valid: false}))
                                }
                            }
                        ]
                    }
                ];
                
                stateInst.set(mockState);
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                await formEl.dispatchEvent(event);

                expect(mockSettings.onFieldValidationError).toHaveBeenCalled();

            });

        });

        describe('for form', () => {
            it('should call formValidationStart', () => {
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                formEl.dispatchEvent(event);

                expect(mockSettings.onFormValidationStart).toHaveBeenCalled();
            });

            it('should call onFormValidationSuccess', () => {
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                formEl.dispatchEvent(event);

                expect(mockSettings.onFormValidationSuccess).toHaveBeenCalled();
            });

            it('should call onFormValidationError', async () => {
                const mockState = [
                    {
                        fieldEl : {
                            classList: {
                                remove: () => true,
                                add: () => true
                            }
                        },
                        rules: [
                            {
                                settings: {events: ['testEvent']},
                                validate: () => {
                                    return new Promise((resolve, reject) => resolve({valid: false}))
                                }
                            }
                        ]
                    }
                ];
                
                stateInst.set(mockState);
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                await formEl.dispatchEvent(event);

                expect(mockSettings.onFormValidationError).toHaveBeenCalled();
            });

            it('should handle a rejected validation tests', async () => {
                const errorMsg = 'Something went horribly wrong';
                const mockState = [
                    {
                        fieldEl : {
                            classList: {
                                remove: () => true,
                                add: () => true
                            }
                        },
                        rules: [
                            {
                                settings: {events: ['testEvent']},
                                validate: () => {
                                    return new Promise((resolve, reject) => reject(errorMsg))
                                }
                            }
                        ]
                    }
                ];
                
                stateInst.set(mockState);
                formValidation(formEl, mockSettings);
                const event = new Event('testEvent');
                await formEl.dispatchEvent(event);

                expect(mockSettings.onFormValidationError).toHaveBeenCalled();

            });

            it('should scroll to error if setting enabled', async () => {
                const mockState = [
                    {
                        fieldEl : {
                            classList: {
                                remove: () => true,
                                add: () => true
                            }
                        },
                        rules: [
                            {
                                settings: {events: ['testEvent']},
                                validate: () => {
                                    return new Promise((resolve, reject) => resolve({
                                        valid: false,
                                        field: {
                                            fieldEl: 'test'
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                ];
                const newSettings = {...mockSettings, ...{scrollToErrorOnSubmit: true}}
                
                stateInst.set(mockState);
                formValidation(formEl, newSettings);
                const event = new Event('testEvent');
                await formEl.dispatchEvent(event);

                expect(errorUtils.scrollToError).toHaveBeenCalled();
            });
       });
    });

    describe('registers multiple fields', () => {
        beforeEach(() => {
            formEl = document.createElement('form');
            const fieldEl1 = document.createElement('div');
            fieldEl1.classList.add('js-validation-field');
            const fieldEl2 = document.createElement('div');
            fieldEl2.classList.add('js-validation-field');
            const inputEl = document.createElement('input');
            
            fieldEl1.appendChild(inputEl);
            fieldEl2.appendChild(inputEl);
            formEl.appendChild(fieldEl1);
            formEl.appendChild(fieldEl2);

            stateInst = state();
            jest.clearAllMocks();
        });

        describe('registerFields', () => {

            it('should generate unique id', () => {
                formValidation(formEl, {});
                expect(idUtils.getUniqueId).toHaveBeenCalledTimes(2);
            });

            it('should check field integrity', () => {
                formValidation(formEl, {});
                expect(formUtils.checkFieldIntegrity).toHaveBeenCalledTimes(2);
            });

            it('should add field', () => {
                formValidation(formEl, {});
                expect(stateInst.addField).toHaveBeenCalledTimes(2);
            });

            it('should add field vals', () => {
                formValidation(formEl, {});
                expect(stateInst.addFieldVals).toHaveBeenCalledTimes(2);
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
                expect(formUtils.checkRuleIntegrity).toHaveBeenCalledTimes(2);
            });
        });
    })
});