import formValidation from '../../../../src/formValidation';
import required from '@degjs/form-validation-required';
import email from '@degjs/form-validation-email';
import pattern from '@degjs/form-validation-pattern';
import minMaxLength from '@degjs/form-validation-min-max-length';

const exampleFormDemo = function() {
    const fvOpts = {
        rules: [
            required({
                message: "REQUIRED"
            }),
            email,
            pattern,
            minMaxLength
        ]
    };

    const formEl = document.querySelector('.js-example-form');
    if (formEl) {
        formValidation(formEl, fvOpts);
    } else {
        console.error('Could not find formEl in document.');
    }
    
}

export default exampleFormDemo();