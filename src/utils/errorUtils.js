import scrollTo from "DEGJS/scrollTo";

const logError = (msg = '', el = null, level = 'log') => {
	const msgPrefix = 'formValidation: ';

	console[level](msgPrefix + msg);
	if (el !== null) {
		console[level](el);
	}
}

const scrollToError = (errorEl, speed, easing) => {
	if (errorEl) {
		scrollTo({
		    element: errorEl,
		    duration: speed,
		    easing: easing
		});
	}
}

export {
	logError,
	scrollToError
};