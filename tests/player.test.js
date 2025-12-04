import {Player} from '../src/player';

const gameboard = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
);

const gameboardWithHit = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
);

gameboardWithHit[5][5] = 'hit';

const mockBoard = {
    getBoard: jest.fn(() => gameboard)
};

const mockBoardWithHit = {
    getBoard: jest.fn(() => gameboardWithHit)
};


describe('player tests', () => {

    test('returns player object', () =>{
        const player = Player();
        expect(typeof player).toBe('object');
    });

    test('return array and be length 2', () =>{
        const computer = Player('computer', mockBoard);
        expect(Array.isArray(computer.computerMove())).toBeTruthy();
        expect(computer.computerMove().length).toBe(2);
    });

    test('returned array to be within boundaries', () =>{
        const computer = Player('computer', mockBoard);
        const move = computer.computerMove();
        expect(move[0]).toBeGreaterThanOrEqual(0);
        expect(move[0]).toBeLessThan(10);
        expect(move[1]).toBeGreaterThanOrEqual(0);
        expect(move[1]).toBeLessThan(10);
    });

    test('test adjacent hits', () =>{
        const computer = Player('computer', mockBoardWithHit);
        computer._setPrevMoveForTest([5, 5]);
        const move = computer.computerMove();
        const validAdjacent = [
            [4, 5],
            [6, 5],
            [5, 4],
            [5, 6]
        ];
        const isAdjacent = validAdjacent.some(
            ([x, y]) => x === move[0] && y === move[1]
        );

        expect(isAdjacent).toBe(true);
    });

});