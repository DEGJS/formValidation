import formValidation from '@degjs/form-validation';
import required from '@degjs/form-validation-required';

import ruleExample from '../examples/individualRuleExample';

const cascadingErrors = function() {
    ruleExample(formValidation, {
        rules: [required({
            events: ['submit']
        })],
        formSelector: '.js-example-form-1'
    });

    ruleExample(formValidation, {
        rules: [required({
            events: ['submit']
        })],
        formSelector: '.js-example-form-2'
    });

    ruleExample(formValidation, {
        rules: [required({
            message: "I'm an error message on the rule.",
            events: ['submit']
        })],
        formSelector: '.js-example-form-3'
    });

    ruleExample(formValidation, {
        defaultErrorMessage: "I'm an error defined in formValidation settings.",
        rules: [required({
            message: '',
            events: ['submit']
        })],
        formSelector: '.js-example-form-4'
    });
}

export default cascadingErrors();