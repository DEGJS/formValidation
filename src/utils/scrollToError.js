import scrollTo from "DEGJS/scrollTo";

function scrollToError(errorEl, speed, easing) {
	if (errorEl) {
		scrollTo({
		    element: errorEl,
		    duration: speed,
		    easing: easing
		});
	}
};

export {
	scrollToError
};