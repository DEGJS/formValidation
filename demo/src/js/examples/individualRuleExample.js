const individualRuleExample = function(formValidation, opts) {
    const validationOpts = {
        rules: opts.rules
    };

    const formEl = document.querySelector(opts.formSelector);
    const validationInst = formValidation(formEl, validationOpts);
}

export default individualRuleExample;