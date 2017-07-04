const renderErrorsEl = (field, settings) => {
	let errorsEl = field.querySelector('.' + settings.errorsClass);
	if (!errorsEl) {
		field.insertAdjacentHTML('beforeend', `
			<div class="${settings.errorsClass} ${settings.defaultErrorsClass}"></div>
		`);
		errorsEl = field.querySelector('.' + settings.errorsClass);
	} else {
		errorsEl.classList.add(settings.errorsClass);
	}
	return errorsEl;
}

const renderValidationMessage = (args, settings) => {
	const msgAttribute = args.rule.settings.messageAttr;
	const field = args.field;
	const messagesArr = [
		field.fieldEl.getAttribute(msgAttribute),
		field.formEl.getAttribute(msgAttribute),
		args.rule.settings.message,
		'Validation error.'
	];
	let correctError = getErrorMessage(messagesArr);

	if (customMessageProcessorIsSet(args)) {
		correctError = args.rule.processMessage(correctError);
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