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

	const getSettings = () => {
		return settings;
	}

	const isRelevant = (field) => {
		return field.inputEls.some(el => el.getAttribute('type') === 'email');
	}

	const validate = (field) => {
		return new Promise(function(resolve, reject) {
			if (field.inputEls) {
				resolve({
					valid: field.inputEls.some(el => el.value.length > 0 && settings.pattern.test(el.value))
				});
			} else {
				reject('email: No inputs set.');
			}			
		});
	}

	const postprocessMessage = (msg) => {
		if (settings.postprocessMessage && typeof settings.postprocessMessage === 'function') {
			return settings.postprocessMessage(msg);
		} else {
			return msg;
		}
	}

	return {
		settings: getSettings(),
		isRelevant: isRelevant,
		validate: validate,
		postprocessMessage: postprocessMessage
	};

}

export default email;