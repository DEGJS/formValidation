let errorHandler = function() {

	let msgPrefix = 'formValidation: ';

	function show(msg = '', el = null) {
		console.log(msgPrefix + msg);
		if (el !== null) {
			console.log(el);
		}
	};

	return {
		show: show
	}

};

let instance = errorHandler();

export default instance;