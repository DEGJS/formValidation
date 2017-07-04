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

	// const processMessage = (msg) => {
	// 	if (settings.processMessage && typeof settings.processMessage === 'function') {
	// 		return settings.processMessage(msg);
	// 	} else {
	// 		return msg.replace('required', 'needed');
	// 	}
	// }

	return {
		settings: getSettings(),
		isRelevant: isRelevant,
		validate: validate
		// processMessage: processMessage
	};

}

export default required;