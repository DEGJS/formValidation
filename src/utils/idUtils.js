const getUniqueId = (el, settings) => {
	const elId = el.getAttribute('id');
	if (elId) {
		return elId;
	} else {
		const id = generateId(settings.generatedIdPrefix);
		el.setAttribute('id', id)
		return id;
	}
}

const generateId = (prefix = '') => {
	return prefix + Math.random().toString(10).substring(5);
}

export {
	getUniqueId,
	generateId
};