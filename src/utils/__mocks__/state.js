const instance = {
    addField: jest.fn(() => {}),
    addFieldVals: jest.fn(),
    getField: jest.fn(),
    removeField: jest.fn(),
    reset: jest.fn()
};

const state = jest.fn();
state.mockImplementation(() => {
    return instance;
})

export default state;