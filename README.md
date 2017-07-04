# formValidation
A modular form validation plugin, free of third-party dependencies and built on top of native HTML5 validation.

## Wait...ANOTHER validation plugin?
You're right; there's no shortage of form validation plugins to choose from. That said, this plugin was written to fulfill some specific needs and workflows that many other validation plugins lack, including:

* No third-party dependencies (especially jQuery)
* Written as an ES6 module, and compatible with the [JSPM package manager](http://jspm.io).
* Extensible, to allow new validation rules (also written as ES6 modules) to be easily written, installed and bundled as needed.
* Built to progressively enhance HTML5 validation patterns whenever possible.
* Promise-based, asynchronous validation rules.
* The ability to add and remove fields from the validation instance on the fly.
* Customizable error messaging that can be set at the field, form or rule level, on a field-by-field basis.

## Install
formValidation is an ES6 module. Consequently, you'll need an ES6 transpiler ([Babel](https://babeljs.io) is a nice one) and a module loader ([SystemJS](https://github.com/systemjs/systemjs) will do the job) as part of your Javascript workflow.

If you're already using [JSPM package manager](http://jspm.io) for your project, you can install formValidation with the following command:

```
$ jspm install github:DEGJS/formValidation
```

formValidation rule modules that are hosted on GitHub or NPM can similarly be installed with JSPM:

```
$ jspm install github:DEGJS/formValidation-required
```

## Dependencies
formValidation doesn't rely on any third-party dependencies, but does make use of three small dependencies from its own [DEGJS](http://degjs.com/) ecosystem. These dependencies will be automatically installed and configured if you install formValidation via JSPM; however, if you install manually, you'll also need to manually include the [domUtils](https://github.com/DEGJS/domUtils), [objectUtils](https://github.com/DEGJS/objectUtils) and [scrollTo](https://github.com/DEGJS/scrollTo) DEGJS modules.

## Usage
formValidation is designed to be modular and does not include any rules modules out of the box. Therefore, you'll need to import and instantiate all of the rule modules needed for your form.

Sample Javascript:
```js
import formValidation from "DEGJS/formValidation";

/* Import the Required and Pattern rule modules */
import pattern from "DEGJS/formValidation-pattern";
import required from "DEGJS/formValidation-required";

/* Configure the rules array alongside other validation options. Default rule settings can be overridden at the rule level during instantiation by calling the rule as a function and passing it an options array. */
let	validationOptions = {
    rules: [
        pattern,
        required({
            message: 'You idiot! This field is required!'
        })
    ]
};

/* Instantiate the formValidation module on an element */
let formElement = document.querySelector('.form');
let validationInst = formValidation(formElement, validationOptions);
```

Sample Markup:
```html
<form class="form">
	<fieldset>
		<div class="js-field">
			<label for="zip">ZIP Code</label>
			<input class="js-field-input" type="text" required pattern="^\d{5}(-\d{4})?$" id="zip" name="zip">
		</div>
		<button type="submit">Submit</button>
	</fieldset>
</form>
```

## Options

#### options.rules
Type: `Array` Default: `null`  
An array of rule module names that should be registered with the validation instance. Each rule in the array must be imported before being instantiated. The rule can be instantiated by listing its name only, or as a function call with options.

#### options.fieldSelector
Type: `String` Default: `.js-validation-field`  
The CSS selector for each field element. NOTE: only fields containing this selector will be included in the validation instance on page load.

#### options.inputsSelector
Type: `String` Default: `input, select, textarea`  
The CSS selector for each field's input elements.

#### options.errorsClass
Type: `String` Default: `validation-field__errors`  
The CSS class added to all error wrapper elements within each field. NOTE: An error wrapper element with this class is automatically added to fields that don't contain one.

#### options.errorClass
Type: `String` Default: `validation-field__error`  
The CSS class added to individual errors, within each field's error wrapper element.

#### options.hasErrorsClass
Type: `String` Default: `has-errors`  
The CSS class added to fields when an error is present.

#### options.generatedIdPrefix
Type: `String` Default: `js-validation-field--`  
formValidation automatically adds randomly generated IDs to fields that don't already have IDs (i.e., `<div class="js-field" id="js-field--9695013748541">`). This option changes the string that preceds the randomly generated number.

#### options.inputParentFieldIdAttr
Type: `String` Default: `data-parent-field-id`  
The data attribute name added to inputs, which corresponds with the ID of its parent field.

#### options.scrollToErrorOnSubmit
Type: `Boolean` Default: `true`  
Scrolls the page to the first field containing an error when form validation fails. This may be useful on long forms. This option uses the DEGJS scrollTo module. More information on this dependency can be found [here](https://github.com/DEGJS/scrollTo).

#### options.scrollToSpeed
Type: `Integer` Default: `500`  
Sets the scroll speed of the `scrollToErrorOnFormSubmit` option.

#### options.scrollToEasing
Type: `String` Default: `easeIn`  
Sets the easing effect of the `scrollToErrorOnFormSubmit` option.

#### options.defaultErrorMessage
Type: `String` Default: `Validation error.`  
Essentially a worst-case scenario error message, should something go wrong with error messages set at the field, form and rule level. You'll probably never see this, but it's configurable, just in case.

#### options.onFormValidationStart
Type: `String` Default: `null`
The name of the callback fired when a form's validation begins.

#### options.onFieldValidationStart
Type: `String` Default: `null`  
The name of the callback fired when a field's validation begins.

#### options.onFormValidationSuccess
Type: `String` Default: `null` 
The name of the event fired when a form's validation passes.

#### options.onFieldValidationSuccess
Type: `String` Default: `null`  
The name of the event fired when a field's validation passes.

#### options.onFormValidationError
Type: `String` Default: `null`  
The name of the event fired when a form's validation fails.

#### options.onFieldValidationError
Type: `String` Default: `null`  
The name of the event fired when a field's validation fails.

## Methods

### .addFields(els)
Parameters: `els`  
An element or array of elements to add to the validation instance.

### .removeFields(els)
Parameters: `els`  
An element or array of elements to remove from the validation instance.

### .reset()
Parameters: `none`  
Removes all registered fields from the validation instance.

## Configuring Error Messages
When an error occurs, formValidation follows a hierarchy to determine which error message to show. This allows fine-grained control over messaging on a field-by-field basis. Error messages will be chosen in the following order:

1. Messages set on the field element via a data attribute. The name of this attribute should be configurable within each rule.
2. Messages set on the form element.
3. A default message set within each rule module. This message can be overridden via the "message" property when instantiating the rule. 
4. A generic fallback message built into formValidation itself.

After the correct error message has been set, it's still possible to process the message before it's displayed (this can be useful when replacing tokens or characters in a message based on a user's input, for example). This can be done via the `postprocessMessage` method within the rule itself, or overridden as a `postprocessMessage` option when instantiating a rule (see the "Writing Your Own Rule" documentation for more information).

## Rules
Several prebuilt rule modules are available via [DEGJS](http://degjs.com), including:
* [Required](https://github.com/DEGJS/formValidation-required)
* [Required Radio Group](https://github.com/DEGJS/formValidation-requiredRadioGroup)
* [Email](https://github.com/DEGJS/formValidation-email)
* [Pattern](https://github.com/DEGJS/formValidation-pattern)
* [Length](https://github.com/DEGJS/formValidation-length)

## Writing Your Own Rule
By following formValidation's rule API, it's also possible to write your own rule module that's asynchronous, Promise-based and can fire on most common [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events) (including form submission, which uses `Promise.all` to validate all of a validation instance's rules at once).

### Anatomy of a Rule
A rule module should return the following methods:

**.events()**  
Parameters: `none`  
Required: `yes`  
Returns: `Array`  
Returns an array of event names on which the rule should fire for relevant fields.

**.isRelevant(containerEl, inputEls, stateId, callback)**  
Parameters: 
Required: `yes`  
Returns: `Boolean`  
Returns a boolean value indicating if the rule is relevant to an indivdual field.

**.validate(matchingField, event)**  
Parameters:  
Required: `yes`  
Returns: `Promise`  
Rules that pass validation should resolve 

Rules that fail validation should also resolve the promise, but return an object:

```js
resolve({
    valid: false,
    message: {
        attribute: 'data-attribute-name',
        message: 'This is the error message'
    },
    matchingField: matchingField
});
```

The validate method should only reject the promise when there is a problem with the rule (i.e., when the matching field passed to it doesn't contain any input elements).

### Sample rule
```js
let required = function() {
	let messages = {
			requiredMsg: {
				attribute: 'data-validation-required-message',
				message: 'This field is required.'
			}
		},
		events = [
			'focusout',
			'submit'
		];

	function getEvents() {
		return events;
	};

	function isRelevant(containerEl, inputEls) {
	    return inputEls.every(function(el) {
	        return el.getAttribute('required') !== null;
	    });
	};

	function validate(matchingField) {
		return new Promise(function(resolve, reject) {
			let inputEls = matchingField.inputEls;
			if (inputEls) {
			    let isValid = inputEls.every(function(el) {
			        return ((el.value) && (el.value.length > 0));
			    });
				if (isValid) {
					resolve({
						valid: true
					});
				} else {
					resolve({
						valid: false,
						message: messages.requiredMsg,
						matchingField: matchingField
					});
				}
			} else {
				reject('no inputs');
			}
			
		});
	};

	return {
		events: getEvents,
		isRelevant: isRelevant,
		validate: validate
	};

};

export default required;
```



## Browser Support

formValidation depends on the following browser APIs:
+ Array.find: [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill)
+ Array.filter: [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Polyfill)
+ Array.prototype.some: [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some#Polyfill)
+ Object.assign: [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill)
+ Array.from: [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill)
+ Array.prototype.reduce: [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Polyfill)


To support legacy browsers, you'll need to include polyfills for the above APIs.   