import './style.css';
import {Ship} from './ship.js';
import {Player} from './player.js';
import {Gameboard} from './gameboard.js';
import {DOMController} from './DOMController.js';
import {GameController} from './GameController.js';

const btnStart = document.querySelector('.start-button');

const shipsPlayer = [
    Ship('Carrier', 5),
    Ship('Battleship', 4),
    Ship('Cruiser', 3),
    Ship('Submarine', 3),
    Ship('Destroyer', 2)
];

const shipsComputer = [
    Ship('Carrier', 5),
    Ship('Battleship', 4),
    Ship('Cruiser', 3),
    Ship('Submarine', 3),
    Ship('Destroyer', 2)
];

const gameboards = [
    Gameboard(),
    Gameboard()
];

const players = [
    Player('Player 1', gameboards[0]),
    Player('Computer', gameboards[1], true)
];

const DOM = DOMController(players, gameboards);
const gameController = GameController(players, gameboards, DOM, shipsPlayer);

shipsComputer.forEach(ship => gameboards[1].placeShipRandomly(ship));

btnStart.addEventListener('click', () =>{
    DOM.renderSetup(shipsPlayer, loadImages, gameController.setupBoard, gameController.randomize, gameController.resetSelection, gameController.rotate);
});

DOM.readyBtn.addEventListener('click', () =>{
    DOM.renderBoards(0, gameController.movesFlow);
});

//Ship Icons Helper
async function loadImages(icon){
    try{
        const module = await import(`../images/${icon}.png`);
        return module.default;
    }catch(e){
        alert(e);
    }
}