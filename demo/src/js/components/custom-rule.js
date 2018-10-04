import formValidation from '../../../../src/formValidation';
import required from '@degjs/form-validation-required';
import cityCheck from '../examples/cityCheckRule';

const customRule = function() {
    const formValidationOpts = {
        rules: [
            required,
            cityCheck({
                message: 'That is not the greatest city in the world. Think "Gateway to the West"'
            })
        ]
    };

    const formEl = document.querySelector('.js-custom-rule-form');
    formValidation(formEl, formValidationOpts);
}

export default customRule();