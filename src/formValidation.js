// DEGJS modules
import { emptyElements, isElement } from "DEGJS/domUtils";
import { ensureArray } from "DEGJS/objectUtils";

// Utils
import state from "./utils/state";
import { getUniqueId, generateId } from "./utils/idUtils";
import { checkFormIntegrity, disableBrowserValidation } from "./utils/formUtils";
import { logError, scrollToError } from "./utils/errorUtils";

// Renderers
import { renderErrorsEl, renderValidationMessage } from "./renderers/renderers";

const formValidation = (formEl, options = {}) => {

	const stateInst = state();
	const errors = {
		invalidFormEl: 'Form element not defined.',
		noRules: 'No rules set.',
		noInputEls: 'No input elements (input, select or textarea) found within field element.',
		noEvents: 'No events set for element.'
	};
	const defaults = {
		rules: [],
		scrollToErrorOnSubmit: true,
		disableFieldEventsOnSubmit: false,
		scrollToSpeed: 500,
		scrollToEasing: 'easeIn',
		generatedIdPrefix: 'js-validation-field--',
		fieldSelector: '.js-validation-field',
		inputsSelector: 'input, select, textarea',
		errorsClass: 'validation-field__errors',
		errorClass: 'validation-field__error',
		hasErrorsClass: 'has-errors',
		inputParentFieldIdAttr: 'data-validation-field-id',
		onFormValidationStart: null,
		onFieldValidationStart: null,
		onFormValidationSuccess: null,
		onFieldValidationSuccess: null,
		onFormValidationError: null,
		onFieldValidationError: null
	};

	let events = [];
	let settings = Object.assign({}, defaults, options);

	const init = () => {
		checkFormIntegrity(formEl, errors, settings)
			.then(response => {
				disableBrowserValidation(formEl);
				registerFields(response.fieldEls);
			})
			.catch(error => {
				logError(error);
			});
	}

	const registerFields = (fieldEls) => {
		fieldEls = ensureArray(fieldEls);
		fieldEls.forEach(fieldEl => {
			const inputEls = Array.from(fieldEl.querySelectorAll(settings.inputsSelector));
			if (inputEls.length > 0) {
				const id = getUniqueId(fieldEl, settings);
				inputEls.forEach(inputEl => inputEl.setAttribute(settings.inputParentFieldIdAttr, id));
				stateInst.addField({
					id: id,
					containerEl: fieldEl,
					errorsEl: renderErrorsEl(fieldEl, settings),
					inputEls: inputEls,
					rules: registerRules(fieldEl, inputEls, id)
				});
			} else {
				logError(errors.noInputEls, fieldEl);
			}
		});
	}

	const registerRules = (containerEl, inputEls, id) => {
		return settings.rules.map(rule => {
			const ruleInst = typeof rule === 'function' ? rule() : rule;
			if (ruleInst.isRelevant(containerEl, inputEls)) {
				registerEvents(ruleInst);
				return {
					name: rule.name,
					events: ruleInst.settings.events,
					messageAttr: ruleInst.settings.messageAttr,
					message: ruleInst.settings.message,
					validate: ruleInst.validate,
					processMessage: ruleInst.processMessage
				};
			}
		});
	}

	const registerEvents = (rule) => {
		const ruleSettings = rule.settings;
		if (ruleSettings && ruleSettings.events && ruleSettings.events.length > 0) {
			ruleSettings.events.forEach(eventName => {
				if (events.indexOf(eventName) === -1) {
					events.push(eventName);
					formEl.addEventListener(eventName, onEvent);
				}
			});
		} else {
			logError(errors.noEvents);
		}
	}

	const onEvent = (event) => {
		if (stateInst.get().length > 0) {
			event.preventDefault();
			const el = event.target;

			if (el === formEl) {
				processCallback(settings.onFormValidationStart, {
					target: formEl,
					event: event
				});
				event.preventDefault();
				const validationTests = stateInst.get().reduce((previousValue, field) => {
					return previousValue.concat(runFieldRules(field, event, settings.disableFieldEventsOnSubmit));
				}, []);

				Promise.all(validationTests)
					.then(testResults => {
						if (testResults.every(result => result.valid === true)) {
							processCallback(settings.onFormValidationSuccess, {
								target: formEl,
								event: event
							}, submitForm);
						} else {
							if (settings.scrollToErrorOnSubmit) {
								const errorEl = responses[0].field.errorEl;
								scrollToError(errorEl, settings.scrollToSpeed, settings.scrollToEasing);
							}
							processCallback(settings.onFormValidationError, {
								target: formEl,
								event: event
							});
						}
					}).catch(error => {
						processCallback(settings.onFormValidationError, {
							target: formEl,
							event: event
						});
					});
			} else {
				const field = stateInst.getField(el.getAttribute(settings.inputParentFieldIdAttr));
				if (field) {
					runFieldRules(field, event);
				}
			}
		}
	}

	const runFieldRules = (field, event, disableEvent = false) => {
		processCallback(settings.onFieldValidationStart, {
			target: field,
			event: event
		});
		clearFieldErrors(field);
		const matchingRules = field.rules.filter(rule => rule.events.indexOf(event.type) !== -1);

		return matchingRules.map(rule => runRule(field, rule, event, disableEvent));
	}

	const runRule = (field, rule, event, disableEvent) => {
		return rule.validate(field, event)
			.then(response => {
				const args = {
					field: field,
					response: response,
					event: event,
					rule: rule,
					disableEvent: disableEvent
				};
				response.valid ? onValidationSuccess(args) : onValidationError(args);
				response.field = field;
				return response;
			})
			.catch(errorMsg => logError(errorMsg));
	}

	const onValidationSuccess = (args) => {
		if (args.disableEvent !== true) {
			processCallback(settings.onFieldValidationSuccess, {
				target: args.field,
				response: args.response,
				event: args.event
			});
		}
	}

	const onValidationError = (args) => {
		if (args.disableEvent !== true) {
			processCallback(settings.onFieldValidationError, {
				target: args.field,
				response: args.response,
				event: args.event
			}, () => {
				args.field.containerEl.classList.add(settings.hasErrorClass);
				renderValidationMessage(formEl, args, settings);
			});
		}
	}

	const clearFieldErrors = (field) => {
		field.containerEl.classList.remove(settings.hasErrorsClass);
		emptyElements(field.errorsEl);
	}

	const removeFields = (elOrIdArr) => {
		elOrIdArr = ensureArray(elOrIdArr);
		elOrIdArr.forEach(elOrId => {
			let id = elOrId;
			if (isElement(elOrId)) {
				const elErrorWrapper = elOrId.querySelector('.' + settings.fieldErrorWrapperClass);
				if (elErrorWrapper) {
					elErrorWrapper.innerHTML = '';
				}
				id = elOrId.getAttribute('id');
			}
			stateInst.removeField(id);
		});
	}

	const processCallback = (callback, vals, elseFn = null) => {
		if (callback !== null) {
			callback(vals.event, vals.target);
		} else {
			if (elseFn !== null) {
				elseFn(vals.event);
			}
		}
	}

	const submitForm = () => {
		formEl.submit();
	}

	const reset = () => {
		stateInst.reset();
	}

	init();

	return {
		addFields: registerFields,
		removeFields: removeFields,
		reset: reset
	};

}

export default formValidation;