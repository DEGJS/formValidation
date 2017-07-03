const renderErrorsEl = (field, settings) => {
	let errorsEl = field.querySelector('.' + settings.errorsClass);
	if (!errorsEl) {
		field.insertAdjacentHTML('beforeend', `
			<div class="${settings.errorsClass}"></div>
		`);
		errorsEl = field.querySelector('.' + settings.errorsClass);
	} else {
		errorsEl.classList.add(settings.errorsClass);
	}
	return errorsEl;
}

const renderValidationMessage = (formEl, args, settings) => {
	const msgAttribute = args.rule.messageAttr;
	const field = args.field;
	const messagesArr = [
		field.containerEl.getAttribute(msgAttribute),
		formEl.getAttribute(msgAttribute),
		args.rule.message,
		'Validation error.'
	];
	let correctError = getErrorMessage(messagesArr);

	if (customMessageProcessorIsSet(args)) {
		correctError = args.rule.processMessage(correctError, args);
	}
	field.errorsEl.insertAdjacentHTML('beforeend', `
		<div class="${settings.errorClass}">${correctError}</div>
	`);
}

const customMessageProcessorIsSet = (args) => {
	return args && args.rule && args.rule.processMessage && typeof args.rule.processMessage === 'function';
}

const getErrorMessage = (messagesArr) => {
	return messagesArr.find(message => message && message.length > 0);
}

export {
	renderErrorsEl,
	renderValidationMessage
};