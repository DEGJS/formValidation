import { emptyElements, isElement } from "DEGJS/domUtils";
import { ensureArray } from "DEGJS/objectUtils";
import eventAggregator from "DEGJS/eventAggregator";
import appState from "./state/appState";
import errorHandler from "./utils/errorHandler";
import { scrollToError } from "./utils/scrollToError"; 
import { renderErrorEl, renderValidationMessage } from "./renderers/renderers"; 

let formValidation = function(formEl, options) {

	let fieldEls,
		events = [],
		generatedFieldIds = [],
		defaults = {
			rules: [
			],
			disableHTML5Validation: true,
			disableFormSubmit: false,
			disableFieldEventsOnFormSubmit: false,
			scrollToErrorOnFormSubmit: true,
			scrollToSpeed: 500,
			scrollToEasing: 'easeIn',
			generatedIdPrefix: 'js-field--',
			fieldSelector: '.js-field',
			fieldInputSelector: '.js-field-input',
			fieldErrorWrapperSelector: '.js-field-error',
			fieldErrorWrapperClass: 'field__error-message',
			fieldHasErrorClass: 'has-error',
			inputParentFieldIdAttr: 'data-parent-field-id',
			onFormValidationStartEvent: 'onFormValidationStart',
			onFormValidationSuccessEvent: 'onFormValidationSuccess',
			onFormValidationErrorEvent: 'onFormValidationError',
			onFieldValidationStartEvent: 'onFieldValidationStart',
			onFieldValidationSuccessEvent: 'onFieldValidationSuccess',
			onFieldValidationErrorEvent: 'onFieldValidationError'
		},
		formIsValid = false,
		settings = Object.assign({}, defaults, options),
		state = appState();

	function init() {
		fieldEls = Array.from(formEl.querySelectorAll(settings.fieldSelector));
		disableHTML5Validation();
		registerFields(fieldEls);
	};

	function registerFields(els) {
		els = ensureArray(els);
		els.forEach(function(el) {
			let id,
				elId = el.getAttribute('id');

			if (elId !== null) {
				id = elId;
			} else {
				id = generateId(settings.generatedIdPrefix);
				while (generatedFieldIds.indexOf(id) !== -1) {
					id = generateId(settings.generatedIdPrefix);
				}
				el.setAttribute('id', id);
			}

			let inputEls = Array.from(el.querySelectorAll(settings.fieldInputSelector));
			inputEls.forEach(function(el) {
				el.setAttribute(settings.inputParentFieldIdAttr, id);
			});
			state.addField({
				id: id,
				containerEl: el,
				errorEl: renderErrorEl(el, settings.fieldErrorWrapperSelector, settings.fieldErrorWrapperClass),
				inputEls: inputEls,
				rules: registerRules(el, inputEls, id)
			});
		});
	};

	function registerRules(containerEl, inputEls, stateId) {
		let rules = [];
		settings.rules.forEach(function(rule) {
			let ruleInst = rule();
			if (ruleInst.isRelevant(containerEl, inputEls, stateId, onRelevantCallback)) {
				if (ruleInst.setId) {
					ruleInst.setId(generateId());
				}
				rules.push(ruleInst);
				registerEvents(ruleInst);
			}
		});
		return rules;
	};

	function registerEvents(rule) {
		rule.events().forEach(function(evtName) {
			if (events.indexOf(evtName) === -1) {
				events.push(evtName);
				formEl.addEventListener(evtName, onEvent);
			}
		});
	};

	function onRelevantCallback(id, ruleId) {
		let matchingField = state.getField(id),
			matchingRule = matchingField.rules.find(function(rule) {
				return ((rule.getId) && (rule.getId() === ruleId));
			});
		matchingField.containerEl.classList.remove(settings.fieldHasErrorClass);
		emptyElements(matchingField.errorEl);
		runRule(matchingField, matchingRule);
	};

	function removeFields(elOrIdArr) {
		elOrIdArr = ensureArray(elOrIdArr);
		elOrIdArr.forEach(function(elOrId) {
			let id = elOrId;
			if (isElement(elOrId)) {
				let elErrorWrapper = elOrId.querySelector('.' + settings.fieldErrorWrapperClass);
				if (elErrorWrapper) {
					elErrorWrapper.innerHTML = '';
				}
				id = elOrId.getAttribute('id');
			}
			state.removeField(id);
		});
	};

	function onEvent(e) {
		if (e.target === formEl) {
			formIsValid = false;
			eventAggregator.publish({
				type: settings.onFormValidationStartEvent,
				data: {
					formEl: formEl,
					event: e
				}
			});
			if (!formIsValid) {
				e.preventDefault();

				let formPasses = false,
					fieldPromises = state.get().reduce(function(previousValue, field) {
						return previousValue.concat(runFieldRules(field, e, settings.disableFieldEventsOnFormSubmit));
					}, []);

				Promise.all(fieldPromises)
					.then(function(response) {
						let check = response.some(function(validationResponse) {
							return !validationResponse.valid;
						});
						if (!check) {
							formIsValid = true;
							if (!settings.disableFormSubmit) {
								formEl.submit();
							}
							eventAggregator.publish({
								type: settings.onFormValidationSuccessEvent,
								data: {
									formEl: formEl,
									event: e,
									response: response
								}
							});
						} else {
							if (settings.scrollToErrorOnFormSubmit) {
								let errorEl = response[0].matchingField.errorEl;
								scrollToError(errorEl, settings.scrollToSpeed, settings.scrollToSpeed);
							}
							eventAggregator.publish({
								type: settings.onFormValidationErrorEvent,
								data: {
									formEl: formEl,
									event: e,
									error: response
								}
							});
						}
					}).catch(function(error) {
						eventAggregator.publish({
							type: settings.onFormValidationErrorEvent,
							data: {
								formEl: formEl,
								event: e,
								error: error
							}
						});
						errorHandler.show(error);
					});
			} else {
				formIsValid = false;
			}
		} else {
			let fieldId = e.target.getAttribute(settings.inputParentFieldIdAttr),
			matchingField = state.getField(fieldId);
			if (matchingField) {
				runFieldRules(matchingField, e);
			}
		}
	};

	function runFieldRules(matchingField, e, disableEvent = false) {
		if (disableEvent !== true) {
			eventAggregator.publish({
				type: settings.onFieldValidationStartEvent,
				data: {
					event: e,
					matchingField: matchingField
				}
			});
		}
		matchingField.containerEl.classList.remove(settings.fieldHasErrorClass);
		emptyElements(matchingField.errorEl);
		let type = e.type,
			matchingRules = matchingField.rules.filter(function(rule) {
				return rule.events(matchingField).indexOf(type) !== -1;
			});
		return matchingRules.map(function(matchingRule) {
			return runRule(matchingField, matchingRule, e, disableEvent);
		});
	};

	function runRule(matchingField, matchingRule, e, disableEvent) {
		return matchingRule.validate(matchingField, e)
			.then(function(response) {
				response.valid ? onValidationSuccess(matchingField, response, e, disableEvent) : onValidationError(matchingField, response, e, disableEvent);
				response.matchingField = matchingField;
				return response;
			})
			.catch(function(errorMsg) {
				errorHandler.show(errorMsg);
			});
	};

	function onValidationSuccess(matchingField, response, e, disableEvent) {
		if ((response.fireEvent !== false) && (disableEvent !== true)) {
			eventAggregator.publish({
				type: settings.onFieldValidationSuccessEvent,
				data: {
					event: e,
					response: response,
					matchingField: matchingField
				}
			});
		}
	};

	function onValidationError(matchingField, response, e, disableEvent) {
		if ((response.fireEvent !== false) && (disableEvent !== true)) {
			eventAggregator.publish({
				type: settings.onFieldValidationErrorEvent,
				data: {
					event: e,
					response: response,
					matchingField: matchingField
				}
			});
		}
		matchingField.containerEl.classList.add(settings.fieldHasErrorClass);
		renderValidationMessage(formEl, matchingField, response.message);
	};

	function generateId(prefix = '') {
		return prefix + Math.random().toString(10).substring(5);
	};

	function disableHTML5Validation() {
		if (settings.disableHTML5Validation) {
			formEl.setAttribute('novalidate', 'novalidate');
		}
	};

	function enableFormSubmit() {
		settings.disableFormSubmit = false;
	}

	function disableFormSubmit() {
		settings.disableFormSubmit = true;
	};

	init();

	return {
		addFields: registerFields,
		removeFields: removeFields,
		enableFormSubmit: enableFormSubmit,
		disableFormSubmit: disableFormSubmit
	};

};

export default formValidation;