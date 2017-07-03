const checkFormIntegrity = (formEl, errors, settings) => {
	return new Promise((resolve, reject) => {
		if (!formEl || formEl.tagName !== 'FORM') {
			reject(errors.invalidFormEl);
		} else {
			const fieldEls = Array.from(formEl.querySelectorAll(settings.fieldSelector));
			if (settings.rules && settings.rules.length === 0) {
				reject(errors.noRules);
			} else {
				resolve({
					fieldEls: fieldEls
				});
			}
		}
	});
}

const disableBrowserValidation = (formEl) => {
	formEl.setAttribute('novalidate', 'novalidate');
}

export {
	checkFormIntegrity,
	disableBrowserValidation
};