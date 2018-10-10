import formValidation from '../../../../src/formValidation';
import required from '@degjs/form-validation-required';
import email from '@degjs/form-validation-email';
import formFieldAppender from '@degjs/form-field-appender';

const addRemoveValidation = function() {
    const formEl = document.querySelector('.js-example-form-1');
    const fieldsetEl = formEl.querySelector('.js-example-fieldset');

    const formValidationInst = formValidation(formEl, {
        rules: [
            email,
            required({
                events: ['submit']
            })
        ]
    });
    
    formFieldAppender(fieldsetEl, {
        firstItemIsRemovable: false,
        onItemAddCallback: addValidation,
        onItemRemoveCallback: removeValidation
    });

    function addValidation(newFieldWrapper) {
        formValidationInst.addFields([newFieldWrapper]);
    }

    function removeValidation(removedFieldWrapper) {
        formValidationInst.removeFields([removedFieldWrapper]);
    }
}

export default addRemoveValidation();