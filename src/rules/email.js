const email = (options) => {

	const defaults = {
		message: 'Please enter a valid email address.',
		messageAttr: 'data-validation-email-message',
		pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		events: [
			'focusout',
			'submit'
		]
	};
	const settings = Object.assign({}, defaults, options);

	const isRelevant = (containerEl, inputEls) => {
		return inputEls.every(el => el.getAttribute('type') === 'email');
	}

	const validate = (field) => {
		return new Promise(function(resolve, reject) {
			if (field.inputEls) {
				resolve({
					valid: field.inputEls.every(el => el.value.length > 0 && settings.pattern.test(el.value))
				});
			} else {
				reject('email: No inputs set.');
			}			
		});
	}

	return {
		settings: settings,
		isRelevant: isRelevant,
		validate: validate
	};

}

export default email;