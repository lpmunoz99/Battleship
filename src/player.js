export function Player(name, gameboard, isComputer = false){

    let score = 0;

    const uniqueMoves = new Set();

    let prevMove = null;

    
    function computerMove(opponentBoard){

        let coord;
        const board = opponentBoard.getBoard();
    
        if(prevMove === null || board[prevMove[0]][prevMove[1]] === null){
            coord = getRandom();
        }else if(board[prevMove[0]][prevMove[1]] === 'hit'){
            do{
    
                const [left, right, up, down] = getAdjacent(prevMove);
    
                const filteredMoves = [left, right, up, down]
                    .filter( (move) => {
                        return move[0] >= 0 && move[0] < 10 && move[1] >= 0 && move[1] < 10;
                    })
                    .filter( (move) => {
                        return board[move[0]][move[1]] !== 'hit' && board[move[0]][move[1]] !== 'miss';
                    });
    
                if (filteredMoves.length === 0) {
                    coord = getRandom();
                    break;
                }
    
                coord = filteredMoves[Math.floor(Math.random() * filteredMoves.length)];
    
            }while(uniqueMoves.has(JSON.stringify(coord)));
                
        }else{
            coord = getRandom();
        }
            
    
        uniqueMoves.add(JSON.stringify(coord));
        prevMove = coord;
    
        return coord;
    
    }

    function getAdjacent(coordinate) {

        const [x, y] = coordinate;

        return [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1], 
            [x, y + 1]  
        ];

    }

    function getRandom(){
        let coord;
        do {
            coord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        } while (uniqueMoves.has(JSON.stringify(coord)));
        return coord;
    }

    const object = {
        getName: () => name,
        getGameboard: () => gameboard,
        getScore: () => score,
        incrementScore: () => score++,
        _setPrevMoveForTest: (coord) => prevMove = coord,
        name,
        score
    };

    if(isComputer){
        object.computerMove = computerMove;
    }

    return object;
}