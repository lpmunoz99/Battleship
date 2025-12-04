import horizontalIcon from '/images/horizontal.png';
import verticalIcon from '/images/vertical.png';

export function DOMController(players, gameboards) {
    const menuContainer = document.querySelector('.menu-container');

    const header = document.createElement('div');
    header.className = 'header';

    const contentContainer = document.createElement('div');

    const boardContainer = document.createElement('div');
    boardContainer.className = 'boards-container';

    const readyBtn = document.createElement('button');
    readyBtn.classList = 'btn-ready';
    readyBtn.textContent = 'Ready';
    readyBtn.disabled = true;

    let selectedShip = null;
    let selectedShipDiv = null;

    async function renderSetup(ships, loadImages, placeShip, randomize, resetSelection, rotate) {
        menuContainer.textContent = "";
        contentContainer.textContent = "";
        contentContainer.className = "setup-container";

        menuContainer.appendChild(header);
        menuContainer.appendChild(contentContainer);

        header.textContent = 'PLACE YOU FLEET';

        const subHeader = document.createElement('div');
        subHeader.className = 'sub-header';
        subHeader.textContent = 'Please click on the ship you want to place into the board';
        header.appendChild(subHeader);

        menuContainer.appendChild(readyBtn);

        // SHIPS CONTAINER 
        const shipsContainer = document.createElement("div");
        shipsContainer.className = "ships-container";
        contentContainer.appendChild(shipsContainer);

        const shipsHeader = document.createElement("div");
        shipsHeader.className = "ships-header";
        shipsContainer.appendChild(shipsHeader);

        const shipsTitle = document.createElement("div");
        shipsTitle.className = "ships-title";
        shipsTitle.textContent = "FLEET";
        shipsHeader.appendChild(shipsTitle);

        const shipButtons = document.createElement("div");
        shipButtons.className = "ship-buttons";
        shipsHeader.appendChild(shipButtons);

        // RESET BUTTON
        const resetBtn = document.createElement("button");
        resetBtn.className = "btn-reset";
        resetBtn.addEventListener('click', () => {
            resetSelection(ships);
            renderSetupBoard(gameboards[0], setupBoard, placeShip);
            readyBtn.disabled = true;
            readyBtn.style.color = '#444346';
            readyBtn.style.borderBottomColor = '#444346';
        });
        shipButtons.appendChild(resetBtn);

        // ROTATE BUTTON
        const rotateBtn = document.createElement("button");
        rotateBtn.className = "btn-rotate";

        const rotateIcon = document.createElement("img");
        rotateIcon.className = "rotate-icon";
        rotateIcon.src = horizontalIcon;
        rotateBtn.appendChild(rotateIcon);

        rotateBtn.addEventListener('click', () => {
            const rotation = rotate();
            rotateIcon.src = rotation ? verticalIcon : horizontalIcon;
        });
        shipButtons.appendChild(rotateBtn);

        // RANDOMIZE BUTTON
        const randomizeBtn = document.createElement("button");
        randomizeBtn.className = "btn-randomize";
        randomizeBtn.textContent = "Randomize";
        randomizeBtn.addEventListener('click', () => {
            randomize(ships);
            renderSetupBoard(gameboards[0], setupBoard, placeShip);
            if(gameboards[0].isFull()){
                readyBtn.disabled = false;
                readyBtn.style.color = '#22d3ee';
                readyBtn.style.borderBottomColor = '#22d3ee';
            }
        });
        shipButtons.appendChild(randomizeBtn);

        // BOARD CONTAINER
        const boardWrapper = document.createElement("div");
        boardWrapper.className = "board-container";
        contentContainer.appendChild(boardWrapper);

        const setupBoard = document.createElement("div");
        setupBoard.className = "setup-board";
        boardWrapper.appendChild(setupBoard);

        // SHIPS LIST
        ships.forEach(async ship => {
            const shipDiv = document.createElement("div");
            shipDiv.className = "ship";
            shipDiv.dataset.id = ship.getName().toLowerCase();
            shipsContainer.appendChild(shipDiv);

            const shipLeft = document.createElement("div");
            shipLeft.className = "ship-left";
            shipDiv.appendChild(shipLeft);

            const shipName = document.createElement("div");
            shipName.className = "ship-name";
            shipName.textContent = ship.getName();
            shipLeft.appendChild(shipName);

            const shipImg = document.createElement("img");
            shipImg.className = "ship-image";
            shipImg.src = await loadImages(ship.getName().toLowerCase());
            shipLeft.appendChild(shipImg);

            const shipRight = document.createElement("div");
            shipRight.className = "ship-right";
            shipDiv.appendChild(shipRight);

            for (let i = 0; i < ship.getLength(); i++) {
                const sq = document.createElement("div");
                sq.className = "ship-square";
                shipRight.appendChild(sq);
            }

            shipDiv.addEventListener("click", () => {
                if (selectedShipDiv) {
                    selectedShipDiv.classList.remove('selected');
                }
                selectedShipDiv = shipDiv;
                selectedShipDiv.classList.add('selected');

                selectedShip = ship;
            });
        });

        // RENDER INITIAL BOARD 
        renderSetupBoard(gameboards[0], setupBoard, placeShip);
    }

    function renderBoards(currentplayer, callback) {
        menuContainer.innerHTML = "";
        boardContainer.innerHTML = "";

        menuContainer.appendChild(header);
        menuContainer.appendChild(boardContainer);

        header.textContent = `${players[currentplayer].getName()}'s Turn…`;

        // LEFT SIDE LAYOUT
        const leftContainer = document.createElement('div');
        leftContainer.className = 'left-container';
        boardContainer.appendChild(leftContainer);

        leftContainer.appendChild(document.createElement('div')); // empty
        const leftNumbers = document.createElement('div');
        leftNumbers.className = 'num-labels';
        leftContainer.appendChild(leftNumbers);

        const leftLetters = document.createElement('div');
        leftLetters.className = 'letter-labels';
        leftContainer.appendChild(leftLetters);

        const leftBoard = document.createElement('div');
        leftBoard.className = 'left-board';
        leftContainer.appendChild(leftBoard);

        leftContainer.appendChild(document.createElement('div')); // empty

        const leftPlayer = document.createElement('div');
        leftPlayer.className = 'left-player';
        leftContainer.appendChild(leftPlayer);

        // RIGHT SIDE LAYOUT
        const rightContainer = document.createElement('div');
        rightContainer.className = 'right-container';
        boardContainer.appendChild(rightContainer);

        rightContainer.appendChild(document.createElement('div')); // empty
        const rightNumbers = document.createElement('div');
        rightNumbers.className = 'num-labels';
        rightContainer.appendChild(rightNumbers);

        const rightLetters = document.createElement('div');
        rightLetters.className = 'letter-labels';
        rightContainer.appendChild(rightLetters);

        const rightBoard = document.createElement('div');
        rightBoard.className = 'right-board';
        rightContainer.appendChild(rightBoard);

        rightContainer.appendChild(document.createElement('div')); // empty

        const rightPlayer = document.createElement('div');
        rightPlayer.className = 'right-player';
        rightContainer.appendChild(rightPlayer);

        const nums = [1,2,3,4,5,6,7,8,9,10];
        const letters = 'ABCDEFGHIJ';

        // RENDER BOTH BOARDS
        gameboards.forEach((element, index) => {
            const board = element.getBoard();

            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[0].length; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';

                    // PLAYER BOARD
                    if (index === 0) {
                        cell.dataset.id = board[i][j];
                    }

                    // ENEMY BOARD
                    if (index === 1) {
                        cell.classList.add('active');
                        if (board[i][j] === 'hit' || board[i][j] === 'miss') {
                            cell.dataset.id = board[i][j];
                        }
                        cell.addEventListener('click', () => callback(i, j));
                    }

                    index === 0 ? leftBoard.appendChild(cell)
                                : rightBoard.appendChild(cell);
                }
            }

            // NUMBERS
            nums.forEach(n => {
                const numCell = document.createElement('div');
                numCell.className = 'num-cell';
                numCell.textContent = n;

                index === 0
                    ? leftNumbers.appendChild(numCell)
                    : rightNumbers.appendChild(numCell);
            });

            // LETTER
            for (const char of letters) {
                const letterCell = document.createElement('div');
                letterCell.className = 'letter-cell';
                letterCell.textContent = char;

                index === 0
                    ? leftLetters.appendChild(letterCell)
                    : rightLetters.appendChild(letterCell);
            }

            // PLAYER LABELS
            const playerName = document.createElement('div');
            playerName.className = 'player-name';
            playerName.textContent = players[index].name;

            const playerScore = document.createElement('div');
            playerScore.className = 'player-score';
            playerScore.textContent = `Score : ${players[index].getScore()}`;

            if (index === 0) {
                leftPlayer.appendChild(playerName);
                leftPlayer.appendChild(playerScore);
            } else {
                rightPlayer.appendChild(playerName);
                rightPlayer.appendChild(playerScore);
            }
        });
    }

    function renderSetupBoard(gameboard, container, callback) {
        const board = gameboard.getBoard();
        container.textContent = "";

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.classList.add('setup');
                cell.dataset.id = board[i][j];

                cell.addEventListener("click", () => {
                    callback([i, j], selectedShip);
                    renderSetupBoard(gameboard, container, callback);
                    if(gameboard.isFull()){
                        readyBtn.disabled = false;
                        readyBtn.style.color = '#22d3ee';
                        readyBtn.style.borderBottomColor = '#22d3ee';
                    }
                });

                container.appendChild(cell);
            }
        }
    }

    function getWinner(name) {
        header.textContent = `${name} Wins!`;
    }

    return {
        renderBoards,
        renderSetup,
        getWinner,
        readyBtn
    };
}