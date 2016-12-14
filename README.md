# formValidation
A modular form validation plugin, free of third-party dependencies and built on top of native HTML5 validation.

## Wait...ANOTHER validation plugin?
You're right; there's no shortage of form validation plugins to choose from. That said, this plugin was written to fulfill some specific needs and workflows that many other validation plugins lack, including:

* No third-party dependencies (especially jQuery)
* Written as an ES6 module, and compatible with the [JSPM package manager](http://jspm.io).
* Extensible, to allow new validation rules (also written as ES6 modules) to be easily written, installed and bundled as needed.
* Built to progressively enhance HTML5 validation whenever possible.
* Promise-based and asynchronous validation.
* The ability to add and remove fields from validation on the fly.
* Customizable error messaging that can be set at the form, field or rule level, on a field-by-field basis.

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
formValidation relies on the EventAggregator module to publish an event whenever:

* The form begins, passes or fails validation.
* Individual form fields begin, pass or fail validation.

Your Javascript code will need to import the EventAggregator module in order to subscribe to these events (see `Options` below for specific event names). You can find out more about EventAggregator [here](https://github.com/DEGJS/eventAggregator).

## Usage
formValidation is designed to be modular and does not include any rules modules out of the box. Therefore, you'll need to import and configure all of the rule modules needed for your form.

Sample Javascript:
```js
import formValidation from "DEGJS/formValidation";

/* Import the Required and Pattern rule modules */
import pattern from "DEGJS/formValidation-pattern";
import required from "DEGJS/formValidation-required";

/* Configure the rule array alongside other validation options */
let	validationOptions = {
    rules: [
        pattern,
        required
    ]
};

/* Instantiate the formValidation module on an element */
let formElement = document.querySelector('.form');
let validationInst = formValidation(formElement, validationOptions);
```

Sample Markup:
```html
<div class="js-field">
	<label for="zip">ZIP Code</label>
	<input class="js-field-input" type="text" required pattern="^\d{5}(-\d{4})?$" id="zip" name="zip">
</div>
```

## Options

#### options.rules
Type: `Array` Default: `null`
An array of rule module names that should be registered with the validation instance. Each rule in the array must be imported.

#### options.disableHTML5Validation
Type: `Boolean` Default: `true`
Disables native HTML5 validation.

#### options.disableFormSubmit
Type: `Boolean` Default: `false`
Disables form submission when the form passes validation.

#### options.disableFieldEventsOnFormSubmit
Type: `Boolean` Default: `false`
By default, field validation events will also fire when the form attempts to validate. In certain situations (i.e., when listening for field and form submission events simulatenously), this could be problematic and can be disabled.

#### options.scrollToErrorOnFormSubmit
Type: `Boolean` Default: `true`
Scrolls the page to the first field containing an error when form validation fails. This may be useful on long forms. This option uses the scrollTo module. More information on this dependency can be found [here](https://github.com/DEGJS/scrollTo).

#### options.scrollToSpeed
Type: `Integer` Default: `500`
Sets the scroll speed of the `scrollToErrorOnFormSubmit` option.

#### options.scrollToEasing
Type: `String` Default: `easeIn`
Sets the easing effect of the `scrollToErrorOnFormSubmit` option.

#### options.generatedIdPrefix
Type: `String` Default: `js-field--`
formValidation automatically adds randomly generated IDs to fields that don't already have IDs (i.e., `<div class="js-field" id="js-field--9695013748541">`). This option changes the string that preceds the randomly generated number.

#### options.fieldSelector
Type: `String` Default: `.js-field`
The CSS selector for each field element.

#### options.fieldInputSelector
Type: `String` Default: `.js-field-input`
The CSS selector for each field's input element.

#### options.fieldErrorWrapperSelector
Type: `String` Default: `.js-field-error`
An error wrapper element is automatically added to fields that don't contain one. This option allows you to define a CSS selector, which may be useful when error wrapper elements are already present within the field.

#### options.fieldErrorWrapperClass
Type: `String` Default: `field__error-message`
The CSS class added to all error wrapper elements.

#### options.fieldHasErrorClass
Type: `String` Default: `has-error`
The CSS class added to fields when an error is present.

#### options.inputParentFieldIdAttr
Type: `String` Default: `data-parent-field-id`
The data attribute name added to inputs, which corresponds with the ID of its parent field.

#### options.onFormValidationStartEvent
Type: `String` Default: `onFormValidationStart`
The name of the event fired by EventAggregator when form validation begins.

#### options.onFormValidationSuccessEvent
Type: `String` Default: `onFormValidationSuccess`
The name of the event fired by EventAggregator when form validation passes.

#### options.onFormValidationErrorEvent
Type: `String` Default: `onFormValidationError`
The name of the event fired by EventAggregator when form validation fails.

#### options.onFieldValidationStartEvent
Type: `String` Default: `onFieldValidationStart`
The name of the event fired by EventAggregator when a field's validation begins.

#### options.onFieldValidationSuccessEvent
Type: `String` Default: `onFieldValidationSuccess`
The name of the event fired by EventAggregator when a field's validation passes.

#### options.onFieldValidationErrorEvent
Type: `String` Default: `onFieldValidationError`
The name of the event fired by EventAggregator when a field's validation fails.

## Methods

### .addFields(els)
Parameters: `els` 
An element or array of elements to add to the validation instance.

### .removeFields(els)
Parameters: `els` 
An element or array of elements to remove from the validation instance.

### .enableFormSubmit()
Parameters: `none` 
Enables a form's submission upon validation success.

### .disableFormSubmit()
Parameters: `none` 
Disables a form's submission upon validation success.

## Configuring Error Messages
When an error occurs, formValidation follows a hierarchy to determine which error message to show. This allows fine-grained control over messaging on a field-by-field basis. Error messages will be chosen in the following order:

1. Messages set on the field element via a data attribute. The name of this attribute should be configurable within each rule.
2. Messages set on the form element.
3. A default message set within each rule module.
4. A generic fallback message built into formValidation itself.

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
			    };
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