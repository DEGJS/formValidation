let appState = function() {

	let defaultState = [],
		state = defaultState;

	function get() {
		return state;
	};

	function getField(id) {
		return state.find(function(item) {
			return item.id === id
		});
	};

	function addField(obj) {
		if (!stateItemExists(obj)) {
			state.push(obj);
		}
	};

	function removeField(id) {
		state = state.filter(function(field) {
			return field.id !== id;
		});
	};

	function stateItemExists(obj) {
		return state.some(function(item) {
			return item.id === obj.id;
		});
	};

	function reset() {
		state = defaultState;
	};

	return {
		get: get,
		getField: getField,
		addField: addField,
		removeField: removeField,
		reset: reset
	};

};

export default appState;