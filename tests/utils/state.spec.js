import state from '../../src/utils/state';

describe('state', () => {
    const stateInst = state();

    it('should be initialized to an empty state', () => {
        expect(stateInst.get()).toEqual([]);
    });

    it('should add a field', () => {
        const id = '1';
        const field1 = {
            id: id
        };
        
        stateInst.addField(field1);

        const currentState = stateInst.get();
        expect(currentState).toHaveLength(1);
        expect(currentState[0].id).toEqual(id);
    });

    it('should not add field if it exists', () => {
        const id = '1';
        const field2 = {
            id: id
        };
        
        stateInst.addField(field2);

        const currentState = stateInst.get();
        expect(currentState).toHaveLength(1);
        expect(currentState[0].id).toEqual(id);
    });

    it('should remove field', () => {
        const idToRemove = '1';

        stateInst.removeField(idToRemove);
        expect(stateInst.get()).toEqual([]);
    });

    it('should add field vals', () => {
        const id = '1';
        const field1 = {
            id: id
        };
        const toAdd = {
            id: id,
            testProp: 'testProp'
        };
        
        stateInst.addField(field1);
        stateInst.addFieldVals(field1, toAdd);

        const currentState = stateInst.get();
        expect(currentState).toHaveLength(1);
        expect(currentState[0]).toEqual(toAdd);
    });

    it('should reset state', () => {
        stateInst.reset();
        expect(stateInst.get()).toEqual([]);
    });
});