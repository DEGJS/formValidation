import {
	renderErrorsEl,
	renderValidationMessage
} from "../../src/renderers/renderers";

describe("renderers", () => {
	describe("renderErrorsEl", () => {
		it("should create errorEl if none exists", () => {
			const expectedErrorEl = document.createElement("div");
			expectedErrorEl.classList.add("field__error-msg");
			expectedErrorEl.classList.add("error-msg");

			const mockFieldEl = document.createElement("div");
			mockFieldEl.classList.add("field");

			const mockSettings = {
				errorsClass: "field__error-msg",
				defaultErrorsClass: "error-msg"
			};

			const returnedEl = renderErrorsEl(mockFieldEl, mockSettings);
			expect(returnedEl).toBeDefined();
			expect(returnedEl).toEqual(expectedErrorEl);
		});

		it("should return errorEl", () => {
			const errorMsgEl = document.createElement("div");
			errorMsgEl.classList.add("field__error-msg");

			const mockFieldEl = document.createElement("div");
			mockFieldEl.classList.add("field");
			mockFieldEl.appendChild(errorMsgEl);

			const mockSettings = {
				errorsClass: "field__error-msg"
			};

			const returnedEl = renderErrorsEl(mockFieldEl, mockSettings);
			expect(returnedEl).toBeDefined();
			expect(returnedEl).toEqual(errorMsgEl);
		});
	});

	describe("renderValidationMessage", () => {
		describe("getErrorMessage", () => {
			it("should get field error msg first", () => {
				const mockArgs = {
					rule: {
						settings: {
							messageAttr: "data-mock-attr"
						}
					},
					field: {
						fieldEl: {
							getAttribute: () => "Field error"
						},
						formEl: {
							getAttribute: () => "Form error"
						},
						errorsEl: document.createElement("div")
					}
				};
				const mockSettings = {errorClass: "field__error-msg"};

				renderValidationMessage(mockArgs, mockSettings);
				expect(mockArgs.field.errorsEl).toMatchInlineSnapshot(`
<div>
  
		
  <div
    class="field__error-msg"
  >
    Field error
  </div>
  
	
</div>
`);
			});

			it("should get form error msg second", () => {
				const mockArgs = {
					rule: {
						settings: {
							messageAttr: "data-mock-attr"
						}
					},
					field: {
						fieldEl: {
							getAttribute: () => ""
						},
						formEl: {
							getAttribute: () => "Form error"
						},
						errorsEl: document.createElement("div")
					}
				};
				const mockSettings = {errorClass: "field__error-msg"};

				renderValidationMessage(mockArgs, mockSettings);
				expect(mockArgs.field.errorsEl).toMatchInlineSnapshot(`
<div>
  
		
  <div
    class="field__error-msg"
  >
    Form error
  </div>
  
	
</div>
`);
			});

			it("should get rule default error message third", () => {
				const mockArgs = {
					rule: {
						settings: {
							messageAttr: "data-mock-attr",
							message: "Rule default message"
						}
					},
					field: {
						fieldEl: {
							getAttribute: () => ""
						},
						formEl: {
							getAttribute: () => ""
						},
						errorsEl: document.createElement("div")
					}
				};
				const mockSettings = {errorClass: "field__error-msg"};

				renderValidationMessage(mockArgs, mockSettings);
				expect(mockArgs.field.errorsEl).toMatchInlineSnapshot(`
<div>
  
		
  <div
    class="field__error-msg"
  >
    Rule default message
  </div>
  
	
</div>
`);
			});

			it("should get default error message last", () => {
				const mockArgs = {
					rule: {
						settings: {
							messageAttr: "data-mock-attr",
							message: ""
						}
					},
					field: {
						fieldEl: {
							getAttribute: () => ""
						},
						formEl: {
							getAttribute: () => ""
						},
						errorsEl: document.createElement("div")
					}
				};
				const mockSettings = {
					errorClass: "field__error-msg",
					defaultErrorMessage: "Default error msg"
				};

				renderValidationMessage(mockArgs, mockSettings);
				expect(mockArgs.field.errorsEl).toMatchInlineSnapshot(`
<div>
  
		
  <div
    class="field__error-msg"
  >
    Default error msg
  </div>
  
	
</div>
`);
			});
		});

		it("should call postprocessMessage, if defined", () => {
            const mockArgs = {
                rule: {
                    settings: {
                        messageAttr: "data-mock-attr",
                        message: ""
                    },
                    postprocessMessage: jest.fn(() => {})
                },
                field: {
                    fieldEl: {
                        getAttribute: () => ""
                    },
                    formEl: {
                        getAttribute: () => ""
                    },
                    errorsEl: document.createElement("div")
                }
            };
            const mockSettings = {
                errorClass: "field__error-msg",
                defaultErrorMessage: "Default error msg"
            };

            renderValidationMessage(mockArgs, mockSettings);
            expect(mockArgs.rule.postprocessMessage).toHaveBeenCalled();
        });
	});
});
