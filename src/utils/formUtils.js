import { logError } from "./errorUtils";

const errors = {
	invalidFormEl: 'Form element not defined.',
	noRules: 'No rules set.',
	noInputEls: 'No input elements (input, select or textarea) found within field element.',
	noRuleSettings: 'The rule "[ruleName]" does not return a settings object, and will not work properly.',
	missingRuleSettingsProperty: 'The rule "[ruleName]" is missing the "[propertyName]" property in its settings object, and will not work properly.',
	missingRuleEvents: 'The rule "[ruleName]" does not contain any events in its settings object, and will not work properly.',
	noRuleIsRelevantMethod: 'The rule "[ruleName]" does not return an isRelevant method, and will not work properly.',
	noRuleValidateMethod: 'The rule "[ruleName]" does not return a validate method, and will not work properly.'
};

const checkFormIntegrity = (formEl, settings) => {
	if (!formEl || formEl.tagName !== 'FORM') {
		logError(errors.invalidFormEl);
	}
	if (settings.rules && settings.rules.length === 0) {
		logError(errors.noRules);
	}
}

const checkFieldIntegrity = (fieldEl, inputEls) => {
	if (!inputEls || inputEls.length === 0) {
		logError(errors.noInputEls, fieldEl);
	}
}

const checkRuleIntegrity = (ruleInst, ruleName) => {
	if (!ruleInst.settings) {
		logError(errors.noRuleSettings.replace('[ruleName]', ruleName));
	} else {
		if (!ruleInst.settings.events || ruleInst.settings.events.length === 0) {
			logError(errors.missingRuleEvents.replace('[ruleName]', ruleName));
		} else {
			const propertyNames = [
				'messageAttr',
				'events'
			];
			propertyNames.forEach(propertyName => {
				if (!ruleInst.settings[propertyName]) {
					const msg = errors.missingRuleSettingsProperty.replace('[propertyName]', propertyName);
					logError(msg.replace('[ruleName]', ruleName));
				}
				
			});
		}
	}
	if (!ruleInst.isRelevant) {
		logError(errors.noRuleIsRelevantMethod.replace('[ruleName]', ruleName));
	}
	if (!ruleInst.validate) {
		logError(errors.noRuleValidateMethod.replace('[ruleName]', ruleName));
	}
}

const disableBrowserValidation = (formEl) => {
	formEl.setAttribute('novalidate', 'novalidate');
}

export {
	checkFormIntegrity,
	checkFieldIntegrity,
	checkRuleIntegrity,
	disableBrowserValidation
};