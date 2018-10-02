// complicated mocking of what the state would look like
let mockVals = [{
    fieldEl : {
        classList: {
            remove: () => true
        }
    },
    rules: [
        {
            settings: {events: ['testEvent']},
            validate: () => {
                return new Promise((resolve, reject) => resolve({valid: true}))
            }
        }
    ]
}];

const getField = jest.fn(() => ({
    rules: []
}));

const getState = jest.fn(() => mockVals);

const setState = stateObjs => {
    mockVals = stateObjs;
}

const instance = {
    addField: jest.fn(() => {}),
    addFieldVals: jest.fn(),
    getField: getField,
    removeField: jest.fn(),
    reset: jest.fn(),
    get: getState,
    set: setState
};

const state = jest.fn();
state.mockImplementation(() => {
    return instance;
})

export default state;