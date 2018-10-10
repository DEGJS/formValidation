// Config
const cityCheck = function(options = {}) {

	const defaults = {
        message: 'That is not the best city in the world.',
        messageAttr: 'data-validation-city-message',
		events: [
			'focusout',
			'submit'
		]
	};
	const settings = Object.assign({}, defaults, options);

	function getSettings() {
		return settings;
	}

	function isRelevant(field) {
		return field.inputEls.some(inputEl => inputEl.getAttribute('data-validation-city-check') !== null);
    }
    
    function checkCity(cityName) {
        return new Promise((resolve, reject) => {
            if (cityName.length === 0 ) {
                resolve();
            } else {
                return setTimeout(() => {
                    resolve(cityName === 'St. Louis')
                }, 500);
            }
		});
    }

	function validate(field) {
		return new Promise((resolve, reject) => {
            if (field.inputEls) {
                const promises = field.inputEls.map(el => checkCity(el.value));
                Promise.all(promises).then(responses => {
                    console.log(responses.every(resp => resp));
                    resolve({
                        valid: responses.every(resp => resp)
                    })
                }).catch(e => {
                    resolve({
                        valid: false
                    })
                });
            } else {
                reject('cityCheck: No inputs set.');
            }
		});
	}

	return {
		settings: getSettings(),
		isRelevant: isRelevant,
		validate: validate
	}

};

export default cityCheck;