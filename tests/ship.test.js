import {Ship} from '../src/ship.js';

describe('ship object tests', () => {

    test('ship object exists', () => {
        const obj = Ship();
        expect(typeof obj).toBe('object');
    });

    test('invalid lenght', () => {
        expect(() => Ship(-1)).toThrow();
    });

    test('test hits function', () => {
        const obj = Ship(3);
        expect(obj.hit()).toBe(1);
    });

    test('test hits below length', () =>{
        const obj = Ship(2);
        obj.hit();
        obj.hit();
        expect(obj.hit()).toBe(2);
    });

    test('test sink check', () =>{
        const obj = Ship(2);
        obj.hit();
        obj.hit();
        expect(obj.isSunk()).toBeTruthy();
    });

});