this['add-remove-validation-bundle'] = this['add-remove-validation-bundle'] || {};
this['add-remove-validation-bundle'].js = (function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  function ensureArray(obj) {
    if (Array.isArray(obj) === false) {
      return [obj];
    }

    return obj;
  }

  function isElement(o) {
    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? o instanceof HTMLElement : o && _typeof(o) === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
  }

  function emptyElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function emptyElements(els) {
    els = ensureArray(els);
    els.forEach(function (el) {
      return emptyElement(el);
    });
  }

  var state = function state() {
    var defaultState = [];
    var state = defaultState.concat();

    var get = function get() {
      return state;
    };

    var getField = function getField(id) {
      return state.find(function (item) {
        return item.id === id;
      });
    };

    var addField = function addField(obj) {
      if (!stateItemExists(obj)) {
        state.push(obj);
      }
    };

    var addFieldVals = function addFieldVals(stateObj, addObj) {
      if (stateItemExists(stateObj)) {
        for (var key in addObj) {
          stateObj[key] = addObj[key];
        }
      }
    };

    var removeField = function removeField(id) {
      state = state.filter(function (field) {
        return field.id !== id;
      });
    };

    var stateItemExists = function stateItemExists(obj) {
      return state.some(function (item) {
        return item.id === obj.id;
      });
    };

    var reset = function reset() {
      state = defaultState.concat();
    };

    return {
      get: get,
      getField: getField,
      addField: addField,
      removeField: removeField,
      addFieldVals: addFieldVals,
      reset: reset
    };
  };

  var getUniqueId = function getUniqueId(el, settings) {
    var elId = el.getAttribute('id');

    if (elId) {
      return elId;
    } else {
      var id = generateId(settings.generatedIdPrefix);
      el.setAttribute('id', id);
      return id;
    }
  };

  var generateId = function generateId() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return prefix + Math.random().toString(10).substring(5);
  };

  function linear(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * currentIteration / totalIterations + startValue;
  }
  function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
    }

    return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
  }
  function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
  }
  function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
  }

  var scrollTo = function scrollTo(options) {
    var fps = 60;
    var currentIteration = 0;
    var totalIterations;
    var initialPosition;
    var totalPositionChange;
    var easingFunction;
    var settings;
    var defaults = {
      element: null,
      position: null,
      duration: 500,
      easing: 'easeOut'
    };

    function init() {
      settings = Object.assign({}, defaults, options);
      var finalPosition = getFinalPosition();

      if (!window.requestAnimationFrame || settings.duration === 0) {
        move(finalPosition);
      } else {
        initialPosition = getInitialPosition();
        totalIterations = Math.ceil(fps * (settings.duration / 1000));
        totalPositionChange = finalPosition - initialPosition;
        easingFunction = getEasingFunction();
        animateScroll();
      }
    }

    function move(amount) {
      document.documentElement.scrollTop = amount;
      document.body.parentNode.scrollTop = amount;
      document.body.scrollTop = amount;
    }

    function getFinalPosition() {
      var finalPosition = settings.element ? settings.element.offsetTop : settings.position;
      var viewportHeight = getViewportHeight();
      var documentHeight = getDocumentHeight();
      var maxPosition = documentHeight - viewportHeight;

      if (finalPosition > maxPosition) {
        finalPosition = maxPosition;
      }

      return finalPosition;
    }

    function getInitialPosition() {
      return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    }

    function getViewportHeight() {
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    function getDocumentHeight() {
      return Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
    }

    function animateScroll() {
      if (currentIteration < totalIterations) {
        currentIteration++;
        var val = Math.round(easingFunction(currentIteration, initialPosition, totalPositionChange, totalIterations));
        move(val);
        window.requestAnimationFrame(animateScroll);
      }
    }

    function getEasingFunction() {
      switch (settings.easing) {
        case "easeOut":
          return easeOutCubic;

        case "easeInOut":
          return easeInOutCubic;

        case "easeIn":
          return easeInCubic;

        default:
          return linear;
      }
    }

    init();
  };

  var logError = function logError() {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'log';
    var msgPrefix = 'formValidation: ';
    console[level](msgPrefix + msg);

    if (el !== null) {
      console[level](el);
    }
  };

  var scrollToError = function scrollToError(errorEl, speed, easing) {
    if (errorEl) {
      scrollTo({
        element: errorEl,
        duration: speed,
        easing: easing
      });
    }
  };

  var errors = {
    invalidFormEl: 'Form element not defined.',
    noRules: 'No rules set.',
    noInputEls: 'No input elements (input, select or textarea) found within field element.',
    noRuleSettings: 'The rule "[ruleName]" does not return a settings object, and will not work properly.',
    missingRuleSettingsProperty: 'The rule "[ruleName]" is missing the "[propertyName]" property in its settings object, and will not work properly.',
    missingRuleEvents: 'The rule "[ruleName]" does not contain any events in its settings object, and will not work properly.',
    noRuleIsRelevantMethod: 'The rule "[ruleName]" does not return an isRelevant method, and will not work properly.',
    noRuleValidateMethod: 'The rule "[ruleName]" does not return a validate method, and will not work properly.'
  };

  var checkFormIntegrity = function checkFormIntegrity(formEl, settings) {
    if (!formEl || formEl.tagName !== 'FORM') {
      logError(errors.invalidFormEl);
    }

    if (settings.rules && settings.rules.length === 0) {
      logError(errors.noRules);
    }
  };

  var checkFieldIntegrity = function checkFieldIntegrity(fieldEl, inputEls) {
    if (!inputEls || inputEls.length === 0) {
      logError(errors.noInputEls, fieldEl);
    }
  };

  var checkRuleIntegrity = function checkRuleIntegrity(ruleInst, ruleName) {
    if (!ruleInst.settings) {
      logError(errors.noRuleSettings.replace('[ruleName]', ruleName));
    } else {
      if (!ruleInst.settings.events || ruleInst.settings.events.length === 0) {
        logError(errors.missingRuleEvents.replace('[ruleName]', ruleName));
      } else {
        var propertyNames = ['messageAttr', 'events'];
        propertyNames.forEach(function (propertyName) {
          if (!ruleInst.settings[propertyName]) {
            var msg = errors.missingRuleSettingsProperty.replace('[propertyName]', propertyName);
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
  };

  var disableBrowserValidation = function disableBrowserValidation(formEl) {
    formEl.setAttribute('novalidate', 'novalidate');
  };

  var renderErrorsEl = function renderErrorsEl(field, settings) {
    var errorsEl = field.querySelector('.' + settings.errorsClass);

    if (!errorsEl) {
      field.insertAdjacentHTML('beforeend', "\n\t\t\t<div class=\"".concat(settings.errorsClass, " ").concat(settings.defaultErrorsClass, "\"></div>\n\t\t"));
      errorsEl = field.querySelector('.' + settings.errorsClass);
    } else {
      errorsEl.classList.add(settings.errorsClass);
    }

    return errorsEl;
  };

  var renderValidationMessage = function renderValidationMessage(args, settings) {
    var msgAttribute = args.rule.settings.messageAttr;
    var field = args.field;
    var messagesArr = [field.fieldEl.getAttribute(msgAttribute), field.formEl.getAttribute(msgAttribute), args.rule.settings.message, settings.defaultErrorMessage];
    var correctError = getErrorMessage(messagesArr);

    if (customMessageProcessorIsSet(args)) {
      correctError = args.rule.postprocessMessage(correctError, field);
    }

    field.errorsEl.insertAdjacentHTML('beforeend', "\n\t\t<div class=\"".concat(settings.errorClass, "\">").concat(correctError, "</div>\n\t"));
  };

  var customMessageProcessorIsSet = function customMessageProcessorIsSet(args) {
    return args && args.rule && args.rule.postprocessMessage && typeof args.rule.postprocessMessage === 'function';
  };

  var getErrorMessage = function getErrorMessage(messagesArr) {
    return messagesArr.find(function (message) {
      return message && message.length > 0;
    });
  };

  // DEGJS modules

  var formValidation = function formValidation(formEl) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var stateInst = state();
    var defaults = {
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
    var events = [];
    var settings = Object.assign({}, defaults, options);

    var init = function init() {
      settings.defaultErrorsClass = 'validation-field__errors--default';
      checkFormIntegrity(formEl, settings);
      disableBrowserValidation(formEl);
      var fieldEls = Array.from(formEl.querySelectorAll(settings.fieldSelector));
      registerFields(fieldEls);
    };

    var registerFields = function registerFields(fieldEls) {
      fieldEls = ensureArray(fieldEls);
      fieldEls.forEach(function (fieldEl) {
        var inputEls = Array.from(fieldEl.querySelectorAll(settings.inputsSelector));
        var id = getUniqueId(fieldEl, settings);
        checkFieldIntegrity(fieldEl, inputEls);
        inputEls.forEach(function (inputEl) {
          return inputEl.setAttribute(settings.inputParentFieldIdAttr, id);
        });
        stateInst.addField({
          id: id,
          formEl: formEl,
          fieldEl: fieldEl,
          inputEls: inputEls,
          errorsEl: renderErrorsEl(fieldEl, settings)
        });
        stateInst.addFieldVals(stateInst.getField(id), {
          rules: registerRules(stateInst.getField(id))
        });
      });
    };

    var registerRules = function registerRules(field) {
      return settings.rules.map(function (rule) {
        var ruleInst = typeof rule === 'function' ? rule() : rule;
        checkRuleIntegrity(ruleInst, rule.name);

        if (ruleInst.isRelevant(field)) {
          registerEvents(ruleInst);
          return ruleInst;
        }
      });
    };

    var registerEvents = function registerEvents(rule) {
      rule.settings.events.forEach(function (eventName) {
        if (events.indexOf(eventName) === -1) {
          events.push(eventName);
          formEl.addEventListener(eventName, onEvent);
        }
      });
    };

    var onEvent = function onEvent(event) {
      if (stateInst.get().length > 0) {
        var el = event.target;

        if (el === formEl) {
          processCallback(settings.onFormValidationStart, {
            fields: stateInst.get(),
            event: event
          });
          event.preventDefault();
          var validationTests = stateInst.get().reduce(function (previousValue, field) {
            return previousValue.concat(runFieldRules(field, event, settings.disableFieldEventsOnSubmit));
          }, []);
          return Promise.all(validationTests).then(function (testResults) {
            if (testResults.every(function (result) {
              return result.valid === true;
            })) {
              processCallback(settings.onFormValidationSuccess, {
                fields: stateInst.get(),
                event: event
              }, submitForm);
            } else {
              if (settings.scrollToErrorOnSubmit) {
                var errorEl = testResults.find(function (result) {
                  return result.valid === false;
                }).field.fieldEl;
                scrollToError(errorEl, settings.scrollToSpeed, settings.scrollToEasing);
              }

              processCallback(settings.onFormValidationError, {
                fields: stateInst.get(),
                event: event
              });
            }
          }).catch(function (error) {
            processCallback(settings.onFormValidationError, {
              fields: stateInst.get(),
              event: event
            });
          });
        } else {
          var field = stateInst.getField(el.getAttribute(settings.inputParentFieldIdAttr));

          if (field) {
            return Promise.all(runFieldRules(field, event));
          }
        }
      }
    };

    var runFieldRules = function runFieldRules(field, event) {
      var disableEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      processCallback(settings.onFieldValidationStart, {
        fields: ensureArray(field),
        event: event
      });
      clearFieldErrors(field);
      var matchingRules = field.rules.filter(function (rule) {
        return rule && rule.settings.events.indexOf(event.type) !== -1;
      });
      return matchingRules.map(function (rule) {
        return runRule(field, rule, event, disableEvent);
      });
    };

    var runRule = function runRule(field, rule, event, disableEvent) {
      return rule.validate(field, event).then(function (response) {
        var args = {
          field: field,
          response: response,
          event: event,
          rule: rule,
          disableEvent: disableEvent
        };
        response.valid ? onValidationSuccess(args) : onValidationError(args);
        response.field = field;
        return response;
      }).catch(function (errorMsg) {
        return logError(errorMsg);
      });
    };

    var onValidationSuccess = function onValidationSuccess(args) {
      if (args.disableEvent !== true) {
        processCallback(settings.onFieldValidationSuccess, {
          fields: ensureArray(args.field),
          event: args.event
        });
      }
    };

    var onValidationError = function onValidationError(args) {
      if (args.disableEvent !== true) {
        processCallback(settings.onFieldValidationError, {
          fields: ensureArray(args.field),
          event: args.event
        });
        args.field.fieldEl.classList.add(settings.hasErrorsClass);
        renderValidationMessage(args, settings);
      }
    };

    var clearFieldErrors = function clearFieldErrors(field) {
      field.fieldEl.classList.remove(settings.hasErrorsClass);
      emptyElements(field.errorsEl);
    };

    var removeFields = function removeFields(elOrIdArr) {
      elOrIdArr = ensureArray(elOrIdArr);
      elOrIdArr.forEach(function (elOrId) {
        var id = elOrId;

        if (isElement(elOrId)) {
          elOrId.classList.remove(settings.hasErrorsClass);
          var elErrorWrapper = elOrId.querySelector('.' + settings.errorsClass);

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
    };

    var processCallback = function processCallback(callback, vals) {
      var elseFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (callback !== null) {
        callback(vals);
      } else if (elseFn !== null) {
        elseFn(vals.event);
      }
    };

    var submitForm = function submitForm() {
      formEl.submit();
    };

    var reset = function reset() {
      stateInst.reset();
    };

    init();
    return {
      addFields: registerFields,
      removeFields: removeFields,
      reset: reset
    };
  };

  var required = function required(options) {
    var defaults = {
      message: 'This field is required.',
      messageAttr: 'data-validation-required-message',
      events: ['focusout', 'submit']
    };
    var settings = Object.assign({}, defaults, options);

    function getSettings() {
      return settings;
    }

    function isRelevant(field) {
      return field.inputEls.some(function (el) {
        return el.getAttribute('required') !== null;
      });
    }

    function validate(field) {
      return new Promise(function (resolve, reject) {
        if (field.inputEls) {
          var firstInputType = field.inputEls[0].getAttribute('type');
          var method = firstInputType === 'checkbox' || firstInputType === 'radio' ? 'some' : 'every';
          resolve({
            valid: field.inputEls[method](function (el) {
              var elType = el.getAttribute('type');

              if (elType === 'checkbox' || elType === 'radio') {
                return el.checked === true;
              } else {
                return el.value.length > 0;
              }
            })
          });
        } else {
          reject('required: No inputs set.');
        }
      });
    }

    function postprocessMessage(msg) {
      if (settings.postprocessMessage && typeof settings.postprocessMessage === 'function') {
        return settings.postprocessMessage(msg);
      } else {
        return msg;
      }
    }

    return {
      settings: getSettings(),
      isRelevant: isRelevant,
      validate: validate,
      postprocessMessage: postprocessMessage
    };
  };

  var email = function email(options) {
    var defaults = {
      message: 'Please enter a valid email address.',
      messageAttr: 'data-validation-email-message',
      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      events: ['focusout', 'submit']
    };
    var settings = Object.assign({}, defaults, options);

    var getSettings = function getSettings() {
      return settings;
    };

    var isRelevant = function isRelevant(field) {
      return field.inputEls.some(function (el) {
        return el.getAttribute('type') === 'email';
      });
    };

    var validate = function validate(field) {
      return new Promise(function (resolve, reject) {
        if (field.inputEls) {
          resolve({
            valid: field.inputEls.some(function (el) {
              return el.value.length === 0 || el.value.length > 0 && settings.pattern.test(el.value);
            })
          });
        } else {
          reject('email: No inputs set.');
        }
      });
    };

    var postprocessMessage = function postprocessMessage(msg) {
      if (settings.postprocessMessage && typeof settings.postprocessMessage === 'function') {
        return settings.postprocessMessage(msg);
      } else {
        return msg;
      }
    };

    return {
      settings: getSettings(),
      isRelevant: isRelevant,
      validate: validate,
      postprocessMessage: postprocessMessage
    };
  };

  var formFieldAppender = function formFieldAppender(wrapperEl, options) {
    var errors = {
      prefix: 'formFieldAppender: ',
      noWrapperEl: 'No wrapper element found.',
      noItemElsFoundInMarkup: 'No item elements found in markup.',
      noItemElsFoundInBlueprint: 'No item elements found in item blueprint.'
    },
        defaultPatterns = {
      id: 'ffa-id-[[index]]',
      name: 'ffa-name-[[index]]',
      for: 'ffa-name-[[index]]'
    };
    var settings,
        itemEls,
        itemElClone,
        defaults = {
      blueprint: null,
      itemClass: 'js-ffa-item',
      addTriggerSelector: '.js-ffa-add-trigger',
      removeTriggerSelector: '.js-ffa-remove-trigger',
      idPatternAttr: 'data-ffa-id-pattern',
      namePatternAttr: 'data-ffa-name-pattern',
      forPatternAttr: 'data-ffa-for-pattern',
      disabledClass: 'is-disabled',
      initialReindex: 1,
      firstItemIsRemovable: true,
      onlyLastItemIsRemovable: false,
      onItemAddCallback: null,
      onItemRemoveCallback: null,
      shouldRemoveItemCallback: null,
      resetNewItemFormVals: true
    };

    function init() {
      settings = Object.assign({}, defaults, options);

      if (wrapperEl) {
        if (settings.blueprint !== null) {
          buildItemElsFromBlueprint();
        }

        itemEls = Array.from(wrapperEl.querySelectorAll('.' + settings.itemClass));

        if (itemEls.length > 0) {
          itemElClone = resetNewItemFormVals(itemEls[0].cloneNode(true));
          disableFirstItemRemoveTrigger();
          setTriggerDisabledState(itemElClone.querySelector(settings.addTriggerSelector), false);
          reindexItems();
          bindEvents();
        } else {
          var err = settings.blueprint !== null ? errors.noItemElsFoundInBlueprint : errors.noItemElsFoundInMarkup;
          logError(err);
        }
      } else {
        logError(errors.noWrapperEl);
      }
    }

    function buildItemElsFromBlueprint() {
      emptyElements(wrapperEl);

      if (isElement(settings.blueprint)) {
        wrapperEl.appendChild(settings.blueprint);
      } else {
        wrapperEl.insertAdjacentHTML('afterbegin', settings.blueprint);
      }

      wrapperEl.children[0].classList.add(settings.itemClass);
    }

    function reindexItems() {
      var attrs = Object.keys(defaultPatterns);

      var _loop = function _loop() {
        var itemEl = itemEls[itemIndex];

        if (itemEl) {
          var matchingEls = Array.from(itemEl.querySelectorAll('[' + attrs.join('], [') + ']')).filter(function (el) {
            return el.nodeName !== 'LABEL';
          });
          matchingEls.forEach(function (el, elIndex) {
            var matchingElArr = [el];

            if (el.nodeName === 'INPUT') {
              var correspondingLabelEl = itemEl.querySelector('label[for="' + el.getAttribute('name') + '"]');

              if (correspondingLabelEl) {
                matchingElArr.push(correspondingLabelEl);
              }
            }
            matchingElArr.forEach(function (matchingElItem) {
              setElAttributes(matchingElItem, itemIndex, elIndex, attrs);
            });
          });
        }
      };

      for (var itemIndex = settings.initialReindex; itemIndex <= itemEls.length; itemIndex++) {
        _loop();
      }
    }

    function setElAttributes(el, itemIndex, elIndex, attrs) {
      attrs.forEach(function (attr) {
        if (el.hasAttribute(attr)) {
          var itemAttrVal = el.getAttribute(settings[attr + 'PatternAttr']);

          if (!itemAttrVal) {
            itemAttrVal = defaultPatterns[attr];
          }

          itemAttrVal = itemAttrVal.replace('[[index]]', itemIndex + '-' + elIndex);
          itemAttrVal = itemAttrVal.replace('[[itemIndex]]', itemIndex);
          itemAttrVal = itemAttrVal.replace('[[itemElIndex]]', elIndex);
          el.setAttribute(attr, itemAttrVal);
        }
      });
    }

    function disableFirstItemRemoveTrigger() {
      if (!settings.firstItemIsRemovable) {
        var triggerEl = itemEls[0].querySelector(settings.removeTriggerSelector);

        if (triggerEl) {
          triggerEl.parentNode.removeChild(triggerEl);
        }
      }
    }

    function bindEvents() {
      wrapperEl.addEventListener('click', onElementClick);
    }

    function onElementClick(e) {
      var clickedEl = e.target;

      if (clickedEl.closest(settings.addTriggerSelector) !== null) {
        e.preventDefault();
        addItem(clickedEl);
      } else if (clickedEl.closest(settings.removeTriggerSelector) !== null) {
        e.preventDefault();
        var itemEl = clickedEl.closest('.' + settings.itemClass);

        if (settings.shouldRemoveItemCallback) {
          if (settings.shouldRemoveItemCallback(itemEl)) {
            removeItem(itemEl);
          }
        } else {
          removeItem(itemEl);
        }
      }
    }

    function addItem(addTriggerEl) {
      var triggerEls = [addTriggerEl],
          newItem = itemElClone.cloneNode(true);

      if (settings.onlyLastItemIsRemovable === true) {
        var siblingRemoveTriggerEl = getSiblingTrigger(addTriggerEl, settings.removeTriggerSelector);

        if (siblingRemoveTriggerEl !== null) {
          triggerEls.push(siblingRemoveTriggerEl);
        }
      }

      triggerEls.forEach(function (triggerEl) {
        setTriggerDisabledState(triggerEl);
      });
      wrapperEl.appendChild(newItem);
      itemEls.push(newItem);
      reindexItems();

      if (settings.onItemAddCallback !== null) {
        settings.onItemAddCallback(newItem, itemEls);
      }
    }

    function removeItem(itemEl) {
      var removeItemIndex = itemEls.indexOf(itemEl);
      itemEls.splice(removeItemIndex, 1);
      wrapperEl.removeChild(itemEl);

      if (itemEls.length > 0) {
        var lastItemEl = itemEls[itemEls.length - 1],
            lastItemAddTriggerEl = lastItemEl.querySelector(settings.addTriggerSelector);
        setTriggerDisabledState(lastItemAddTriggerEl, false);
      }

      reindexItems();

      if (settings.onItemRemoveCallback !== null) {
        settings.onItemRemoveCallback(itemEl, itemEls);
      }
    }

    function setTriggerDisabledState(triggerEl) {
      var isDisabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var ariaAttr = 'aria-disabled',
          classListMethodName = isDisabled === true ? 'add' : 'remove';

      if (triggerEl) {
        triggerEl.classList[classListMethodName](settings.disabledClass);
        triggerEl.setAttribute(ariaAttr, isDisabled);
        triggerEl.disabled = isDisabled;
      }
    }

    function resetNewItemFormVals(item) {
      if (settings.resetNewItemFormVals === true) {
        var allInputEls = Array.from(item.querySelectorAll('input', 'textarea', 'select'));
        allInputEls.forEach(function (input) {
          switch (input.nodeName) {
            case 'TEXTAREA':
              input.innerHTML = '';
              break;

            default:
              input.value = '';
              input.checked = false;
              break;
          }
        });
      }

      return item;
    }

    function getSiblingTrigger(triggerEl, siblingSelector) {
      return triggerEl.closest('.' + settings.itemClass).querySelector(siblingSelector);
    }

    function getItems() {
      return itemEls;
    }

    function logError(msg) {
      var logLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'warn';
      console[logLevel](errors.prefix + msg);
    }

    function destroy() {
      wrapperEl.removeEventListener('click', onElementClick);
    }
    init();
    return {
      destroy: destroy,
      getItems: getItems
    };
  };

  var addRemoveValidation = function addRemoveValidation() {
    var formEl = document.querySelector('.js-example-form-1');
    var fieldsetEl = formEl.querySelector('.js-example-fieldset');
    var formValidationInst = formValidation(formEl, {
      rules: [email, required({
        events: ['submit']
      })]
    });
    formFieldAppender(fieldsetEl, {
      firstItemIsRemovable: false,
      onItemAddCallback: addValidation,
      onItemRemoveCallback: removeValidation
    });

    function addValidation(newFieldWrapper) {
      formValidationInst.addFields([newFieldWrapper]);
    }

    function removeValidation(removedFieldWrapper) {
      formValidationInst.removeFields([removedFieldWrapper]);
    }
  };

  var addRemoveValidation$1 = addRemoveValidation();

  return addRemoveValidation$1;

}());
