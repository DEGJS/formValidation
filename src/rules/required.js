const required = (options) => {

	const defaults = {
		message: 'This field is required.',
		messageAttr: 'data-validation-required-message',
		events: [
			'focusout',
			'submit'
		]
	};
	let settings = Object.assign({}, defaults, options);

	const getSettings = () => {
		return settings;
	}

	const isRelevant = (field) => {
		return field.inputEls.some(el => el.getAttribute('required') !== null);
	}

	const validate = (field) => {
		return new Promise(function(resolve, reject) {
			if (field.inputEls) {
				resolve({
					valid: field.inputEls.some(el => el.value.length > 0)
				});
			} else {
				reject('required: No inputs set.');
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

export default required;