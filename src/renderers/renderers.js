function renderErrorEl(matchingField, errorSelector, errorClass) {
	let errorEl = matchingField.querySelector('.' + errorClass);
	if (errorEl === null) {
		matchingField.insertAdjacentHTML('beforeend', `
			<span class="${errorClass}"></span>
		`);
		errorEl = matchingField.querySelector('.' + errorClass);
	} else {
		errorEl.classList.add(errorClass);
	}
	return errorEl;
};

function renderValidationMessage(formEl, matchingField, msgObj) {
	let msgAttribute = msgObj.attribute,
		messagesArr = [
			matchingField.containerEl.getAttribute(msgAttribute),
			formEl.getAttribute(msgAttribute),
			msgObj.message,
			'Validation error.'
		],
		correctError = getErrorMessage(messagesArr);
		if (msgObj.renderCallback) {
			correctError = msgObj.renderCallback(correctError, matchingField);
		}
	matchingField.errorEl.insertAdjacentHTML('beforeend', `
		${correctError}
		<br>
	`);
};

function getErrorMessage(messagesArr) {
	return messagesArr.find(function(message) {
		return ((message) && (message.length > 0));
	});
};

export {
	renderErrorEl,
	renderValidationMessage
};