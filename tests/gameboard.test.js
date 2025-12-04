import { gameboard } from "../src/gameboard";

const mockShip = {
    hits: 0,
    getLength: jest.fn(() => 3),
    isSunk: jest.fn()
};

mockShip.hit = jest.fn(() => mockShip.hits++);

describe('gameboard tests', () => {

    test('gameboard object exists', () => {
        const obj = gameboard();
        expect(typeof obj).toBe('object');
    });

    test('gameboard length', () => {
        const obj = gameboard();
        expect(obj.getSize()).toBe(100);
    });

    test('return array will squares filled', () => {
        const obj = gameboard();
        obj.placeShip([0,1], mockShip);
        const board = obj.getBoard();
        expect(board[0][1]).toBe('ship');
        expect(board[0][2]).toBe('ship');
        expect(board[0][3]).toBe('ship');
    });

    test('out of bound initial coords', () => {
        const obj = gameboard();
        expect(() => obj.placeShip([11,-2], mockShip)).toThrow(Error);
    });

    test('out of bound coords', () => {
        const obj = gameboard();
        expect(() => obj.placeShip([0,9], mockShip)).toThrow(Error);
    });

    test('avoid repeated coordinates', () => {
        const obj = gameboard();
        obj.placeShip([0,1], mockShip);
        expect(() => obj.placeShip([0,0], mockShip)).toThrow(Error);
    });

    test('return hits for ship', () => {
        const obj = gameboard();
        obj.placeShip([0,1], mockShip);
        obj.receiveAttack([0,2]);
        expect(mockShip.hits).toBe(1);
        expect(obj.getBoard()[0][2]).toBe('hit');
    });

    test('return only one hit on repeated coordinate', () => {

        const mockShip2 = {
            hits: 0,
            getLength: jest.fn(() => 3),
            isSunk: jest.fn(),
            getName: jest.fn(() => 'ship1')
        };
        
        mockShip2.hit = jest.fn(() => mockShip2.hits++);

        const obj = gameboard();
        obj.placeShip([0,1], mockShip2);
        obj.receiveAttack([0,2]);
        obj.receiveAttack([0,2]);
        expect(mockShip2.hit).toHaveBeenCalledTimes(1);
    });


    test('test all ships sank', () => {

        const mockShip1 = {
            hits: 0,
            getLength: jest.fn(() => 1),
        };
        
        mockShip1.hit = jest.fn(() => mockShip1.hits++);
        mockShip1.isSunk = jest.fn(() => {
            if(mockShip1.hits === mockShip1.getLength()){
                return true;
            }else{
                return false;
            }
        });

        const mockShip2 = {
            hits: 0,
            getLength: jest.fn(() => 1),
        };
        
        mockShip2.hit = jest.fn(() => mockShip2.hits++);
        mockShip2.isSunk = jest.fn(() => {
            if(mockShip2.hits === mockShip2.getLength()){
                return true;
            }else{
                return false;
            }
        });

        const obj = gameboard();
        obj.placeShip([0,0], mockShip1);
        obj.placeShip([0,2], mockShip2);
        obj.receiveAttack([0,0]);
        obj.receiveAttack([0,2]);
        expect(obj.allSunk()).toBeTruthy();
    });
    
});