const state = () => {

	const defaultState = [];
	let state = [...defaultState];

	const get = () => {
		return state;
	}

	const getField = (id) => {
		return state.find(item => item.id === id);
	}

	const addField = (obj) => {
		if (!stateItemExists(obj)) {
			state.push(obj);
		}
	}

	const removeField = (id) => {
		state = state.filter(field => field.id !== id);
	}

	const stateItemExists = (obj) => {
		return state.some(item => item.id === obj.id);
	}

	const reset = () => {
		state = [...defaultState];
	}

	return {
		get: get,
		getField: getField,
		addField: addField,
		removeField: removeField,
		reset: reset
	};

}

export default state;