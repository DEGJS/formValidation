const required = (options) => {

	const defaults = {
		message: 'This field is required.',
		messageAttr: 'data-validation-required-message',
		events: [
			'focusout',
			'submit'
		]
	};
	const settings = Object.assign({}, defaults, options);

	const isRelevant = (containerEl, inputEls) => {
		return inputEls.every(el => el.getAttribute('required') !== null);
	}

	const validate = (field) => {
		return new Promise(function(resolve, reject) {
			if (field.inputEls) {
				resolve({
					valid: field.inputEls.every(el => el.value.length > 0)
				});
			} else {
				reject('required: No inputs set.');
			}
		});
	}

	// const processMessage = (msg, response) => {
	// 	return msg.replace('required', 'needed');
	// }

	return {
		settings: settings,
		isRelevant: isRelevant,
		validate: validate
		// processMessage: processMessage
	};

}

export default required;