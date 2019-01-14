// DEGJS modules
import { emptyElements, isElement } from "@degjs/dom-utils";
import { ensureArray } from "@degjs/object-utils";

// Utils
import state from "./utils/state";
import { getUniqueId } from "./utils/idUtils";
import { checkFormIntegrity, checkFieldIntegrity, checkRuleIntegrity, disableBrowserValidation } from "./utils/formUtils";
import { logError, scrollToError } from "./utils/errorUtils";

// Renderers
import { renderErrorsEl, renderValidationMessage } from "./renderers/renderers";

const formValidation = (formEl, options = {}) => {

	const stateInst = state();
	const defaults = {
		rules: [],
		fieldSelector: '.js-validation-field',
		inputsSelector: 'input, select, textarea',
		errorsClass: 'validation-field__errors',
		errorClass: 'validation-field__error',
		hasErrorsClass: 'has-errors',
		generatedIdPrefix: 'js-validation-field--',
		inputParentFieldIdAttr: 'data-validation-field-id',
		scrollToErrorOnSubmit: true,
		scrollToSpeed: 500,
		scrollToEasing: 'easeIn',
		defaultErrorMessage: 'Validation error.',
		disableFieldEventsOnSubmit: false,
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
		settings.defaultErrorsClass = 'validation-field__errors--default';
		checkFormIntegrity(formEl, settings);
		disableBrowserValidation(formEl);
		const fieldEls = Array.from(formEl.querySelectorAll(settings.fieldSelector));
		registerFields(fieldEls);
	}

	const registerFields = fieldEls => {
		fieldEls = ensureArray(fieldEls);
		fieldEls.forEach(fieldEl => {
			const inputEls = Array.from(fieldEl.querySelectorAll(settings.inputsSelector));
			const id = getUniqueId(fieldEl, settings);
			checkFieldIntegrity(fieldEl, inputEls);
			inputEls.forEach(inputEl => inputEl.setAttribute(settings.inputParentFieldIdAttr, id));
			stateInst.addField({
				id: id,
				formEl: formEl,
				fieldEl: fieldEl,
				inputEls: inputEls,
				errorsEl: renderErrorsEl(fieldEl, settings)
			});
			stateInst.addFieldVals(stateInst.getField(id), {
				rules: registerRules(stateInst.getField(id))
			})
		});
	}

	const registerRules = field => {
		return settings.rules.map(rule => {
			const ruleInst = typeof rule === 'function' ? rule() : rule;
			checkRuleIntegrity(ruleInst, rule.name);
			if (ruleInst.isRelevant(field)) {
				registerEvents(ruleInst);
				return ruleInst;
			}
		});
	}

	const registerEvents = rule => {
		rule.settings.events.forEach(eventName => {
			if (events.indexOf(eventName) === -1) {
				events.push(eventName);
				formEl.addEventListener(eventName, onEvent);
			}
		});
	}

	const onEvent = event => {
		if (stateInst.get().length > 0) {
			const el = event.target;
			if (el === formEl) {
				processCallback(settings.onFormValidationStart, {
					fields: stateInst.get(),
					event: event
				});
				event.preventDefault();
				const validationTests = stateInst.get().reduce((previousValue, field) => {
					return previousValue.concat(runFieldRules(field, event, settings.disableFieldEventsOnSubmit));
				}, []);

				return Promise.all(validationTests)
					.then(testResults => {
						if (testResults.every(result => result.valid === true)) {
							processCallback(settings.onFormValidationSuccess, {
								fields: stateInst.get(),
								event: event
							}, submitForm);
						} else {
							if (settings.scrollToErrorOnSubmit) {
								const errorEl = testResults.find(result => result.valid === false).field.fieldEl;
								scrollToError(errorEl, settings.scrollToSpeed, settings.scrollToEasing);
							}
							processCallback(settings.onFormValidationError, {
								fields: stateInst.get(),
								event: event
							});
						}
					}).catch(error => {
						processCallback(settings.onFormValidationError, {
							fields: stateInst.get(),
							event: event
						});
					});
			} else {
				const field = stateInst.getField(el.getAttribute(settings.inputParentFieldIdAttr));
				if (field) {
					
					return Promise.all(runFieldRules(field, event));
				}
			}
		}
	}

	const runFieldRules = (field, event, disableEvent = false) => {
		processCallback(settings.onFieldValidationStart, {
			fields: ensureArray(field),
			event: event
		});
		clearFieldErrors(field);
		const matchingRules = field.rules.filter(rule => rule && rule.settings.events.indexOf(event.type) !== -1);
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

	const onValidationSuccess = args => {
		if (args.disableEvent !== true) {
			processCallback(settings.onFieldValidationSuccess, {
				fields: ensureArray(args.field),
				event: args.event
			});
		}
	}

	const onValidationError = args => {
		if (args.disableEvent !== true) {
			processCallback(settings.onFieldValidationError, {
				fields: ensureArray(args.field),
				event: args.event
			});
			args.field.fieldEl.classList.add(settings.hasErrorsClass);
			renderValidationMessage(args, settings);
		}
	}

	const clearFieldErrors = field => {
		field.fieldEl.classList.remove(settings.hasErrorsClass);
		emptyElements(field.errorsEl);
	}

	const removeFields = elOrIdArr => {
		elOrIdArr = ensureArray(elOrIdArr);
		elOrIdArr.forEach(elOrId => {
			let id = elOrId;
			if (isElement(elOrId)) {
				elOrId.classList.remove(settings.hasErrorsClass);
				const elErrorWrapper = elOrId.querySelector('.' + settings.errorsClass);
				if (elErrorWrapper) {
					emptyElements(elErrorWrapper);
					if (elErrorWrapper.classList.contains(settings.defaultErrorsClass)) {
						elErrorWrapper.parentNode.removeChild(elErrorWrapper);
					}
				}
				id = elOrId.getAttribute('id');
			}
			stateInst.removeField(id);
		});
	}

	const processCallback = (callback, vals, elseFn = null) => {
		if (callback !== null) {
			callback(vals);
		} else if (elseFn !== null) {
			elseFn(vals.event);
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