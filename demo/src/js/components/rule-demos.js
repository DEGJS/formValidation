import formValidation from '@degjs/form-validation';
import required from '@degjs/form-validation-required';
import email from '@degjs/form-validation-email';
import pattern from '@degjs/form-validation-pattern';
import minMaxLength from '@degjs/form-validation-min-max-length';

import ruleExample from '../examples/individualRuleExample';

const demo = function() {
    function init() {
        ruleExample(formValidation, {
            rules: [required],
            formSelector: '.js-example-form-1'
        });

        ruleExample(formValidation, {
            rules: [email],
            formSelector: '.js-example-form-2'
        });

        ruleExample(formValidation, {
            rules: [pattern],
            formSelector: '.js-example-form-3'
        });

        ruleExample(formValidation, {
            rules: [minMaxLength],
            formSelector: '.js-example-form-4'
        });
    }

    init();
};

export default demo();