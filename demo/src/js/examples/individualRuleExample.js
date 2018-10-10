const individualRuleExample = function(formValidation, opts) {
    const validationOpts = {
        defaultErrorMessage: opts.defaultErrorMessage,
        rules: opts.rules
    };

    const formEl = document.querySelector(opts.formSelector);
    const validationInst = formValidation(formEl, validationOpts);
}

export default individualRuleExample;