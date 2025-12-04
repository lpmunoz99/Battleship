export function GameController(players, gameboards, DOM, ships){

    let currentplayer = 0;
    let canClick = true;

    function switchTurn(){
        currentplayer = currentplayer === 0 ? 1 : 0;
    }

    function getCurrentPlayer(){
        return players[currentplayer];
    }

    function updateDOM(){
        return DOM.renderBoards(currentplayer, movesFlow);
    }

    function setupBoard(coords, ship) {
        if (!ship) return;
        if (ship.isPlaced() === true) return;
        
        try{
            gameboards[0].placeShip([coords[0], coords[1]], ship);
            ship.markPlaced();
        }catch(e){

        }
    }

    function randomize(ships){
        gameboards[0].clearBoard();
        ships.forEach(ship => {
            ship.markPlaced();
            gameboards[0].placeShipRandomly(ship);
        });
    }

    function resetSelection(){
        gameboards[0].clearBoard();
        ships.forEach(ship => {
            if(ship.isPlaced()){
                ship.unmark();
            }
        });
    }

    function rotate(){
        gameboards[0].changeRotation();
        return gameboards[0].getRotate();
    }

    function movesFlow(i, j){
        if(!canClick) return;

        // ------- HUMAN MOVE -------
        const enemyBoard = gameboards[1];

        const humanAttack = enemyBoard.receiveAttack([i, j]);
        
        if(!humanAttack) return;

        canClick = false;

        const humanShip = enemyBoard.getShip([i, j]);
        if (typeof humanShip === 'object') {
            if (humanShip.isSunk()) {
                players[0].incrementScore();
            }
        }
        
        switchTurn();
        updateDOM();
        if(enemyBoard.allSunk()){
            DOM.getWinner(players[0].name);
            return;
        } 

        // ------- COMPUTER MOVE -------
        const myBoard = gameboards[0];
        
        const coord = players[1].computerMove(myBoard);
        setTimeout(() => {
            myBoard.receiveAttack(coord);
            const computerShip = myBoard.getShip(coord);
            if (typeof computerShip === 'object') {
                if (computerShip.isSunk()) {
                    players[1].incrementScore();
                    
                }
            }
            
            switchTurn();
            updateDOM();
            if(myBoard.allSunk()){
                DOM.getWinner(players[1].name);
                return;
            }
            canClick = true;
            
        }, 500);
    }

    return {movesFlow, getCurrentPlayer, setupBoard, randomize, resetSelection, rotate}
}