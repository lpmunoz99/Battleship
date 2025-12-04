export function Gameboard(){

    let rotate = false;

    let board = [];

    for(let i = 0; i < 10; i++){
        board[i] = [];
        for(let j = 0; j < 10; j++){
            board[i][j] = null;
        }
    }

    let shipsMap = {};

    const usedSquares = new Set();

    const missedShots = new Set();

    const shipSet = new Set();

    function placeShip(coordinate, ship){

        let x = coordinate[0];
        let y = coordinate[1];

        if(x < 0 || x >= 10 || y < 0 || y >= 10) throw new Error('Initial coordinates out of bounds');

        const coordinates = findSquares(coordinate, ship);

        for(let i = 0; i < coordinates.length; i++){
            const [row, col] = coordinates[i];
            board[row][col] = ship.getName().toLowerCase();
            usedSquares.add(JSON.stringify([row, col]));
            shipSet.add(ship);
        }

    }

    function placeShipRandomly(ship) {
        let placed = false;
        rotate = Math.random() < 0.5;
        while (!placed) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
    
            try {
                placeShip([x, y], ship);
                placed = true;
            } catch (e) {

            }
        }
    }

    function findSquares(coordinate, ship){

        const squares = [];

        let x = coordinate[0];
        let y = coordinate[1];

        

        let i = 0;

        while(i < ship.getLength()){

            if(x < 0 || x >= 10 || y < 0 || y >= 10) throw new Error('Out of bounds');

            if(usedSquares.has(JSON.stringify([x,y]))) throw new Error ('Coordinates already occupied');

            squares.push([x,y]);

            rotate ? x++ : y++;
            i++;
        }

        for (const sq of squares){
            shipsMap[JSON.stringify(sq)] = ship;
        }

        return squares;
    }

    function receiveAttack(coordinate){

        let x = coordinate[0];
        let y = coordinate[1];

        if(x < 0 || x >= 10 || y < 0 || y >= 10) throw new Error('Out of bounds');

        if(missedShots.has(JSON.stringify(coordinate)) || board[x][y] === 'hit') return;

        if(board[x][y] === null){
            missedShots.add(JSON.stringify(coordinate));
            board[x][y] = 'miss';
            return 'miss';
        }else if(board[x][y] !== 'miss' && board[x][y] !== null){
            const ship = shipsMap[JSON.stringify(coordinate)];
            ship.hit();
            board[x][y] = 'hit';
            return 'hit';
        }
    }

    function clearBoard(){
        for(let i = 0; i < 10; i++){
            board[i] = [];
            for(let j = 0; j < 10; j++){
                board[i][j] = null;
            }
        }

        usedSquares.clear();
        missedShots.clear();
        shipSet.clear();

        shipsMap = {};
    }

    function allSunk(){
        return [...shipSet].every(ship => ship.isSunk());
    }

    function getSize(){
        return board.length * board[0].length;
    }

    function getBoard(){
        return board;
    }

    function getShip(coordinate){
        return shipsMap[JSON.stringify(coordinate)];
    }

    function isFull(){
        return shipSet.size === 5;
    }

    return {
        getSize,
        getBoard,
        placeShip,
        receiveAttack,
        allSunk,
        placeShipRandomly,
        getShip,
        clearBoard,
        changeRotation: () => rotate = !rotate,
        getRotate: () => rotate,
        isFull
    }
}