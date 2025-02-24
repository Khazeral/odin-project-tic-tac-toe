const messageBoard = document.querySelector("#status");
const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.querySelector("#reset");

const cell = (id) => {
    let value = "";
    let index = id;

    const markCase = (symbol) => {
        if (value === "") {
            value = symbol;
        }
    };

    const getValue = () => value;

    const reset = () => {
        value = "";
    };

    return { index, markCase, getValue, reset };
};

const GameBoard = () => {
    let board = [];

    const createGameBoard = () => {
        board = [];
        for (let i = 1; i <= 9; i++) {
            board.push(cell(i));
        }
    };

    const addMark = (spot, symbol) => {
        const spotNumber = parseInt(spot, 10);
        const cellToMark = board.find((cell) => cell.index === spotNumber);

        if (cellToMark && cellToMark.getValue() === "") {
            cellToMark.markCase(symbol);
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board.forEach(cell => cell.reset());
    };

    const getBoard = () => board;

    return { board, createGameBoard, addMark, getBoard, resetBoard };
};

const createPlayer = (playerName, playerSymbol) => {
    return { name: playerName, symbol: playerSymbol };
};

const gameController = (function () {
    const player1 = createPlayer("Philippe", "X");
    const player2 = createPlayer("Marcel", "O");
    const gameBoard = GameBoard();
    gameBoard.createGameBoard();

    let turns = 0;
    let currentPlayer = player1;
    let isWinnerDetermined = false;

    const playGame = function () {
        messageBoard.textContent = `It's ${currentPlayer.name}'s Turn!`;

        cells.forEach((cell) => cell.addEventListener("click", function place(event) {
            let spotChosen = event.target.dataset.cell;

            if (isWinnerDetermined) return;

            if (gameBoard.addMark(spotChosen, currentPlayer.symbol)) {
                event.target.textContent = currentPlayer.symbol;
                
                turns++;

                if (checkWinner(currentPlayer, gameBoard.getBoard())) {
                    messageBoard.textContent = `Congratulations, ${currentPlayer.name} has won!`;
                    isWinnerDetermined = true;
                    return;
                }

                if (turns === 9) {
                    messageBoard.textContent = `Game has tied!`;
                    return;
                }

                currentPlayer = (currentPlayer === player1) ? player2 : player1;
                messageBoard.textContent = `It's ${currentPlayer.name}'s Turn!`;
            }
        }));
    };

    const resetGame = function () {
        gameBoard.resetBoard();
        turns = 0;
        currentPlayer = player1;
        isWinnerDetermined = false;
        messageBoard.textContent = `It's ${currentPlayer.name}'s Turn!`;
        cells.forEach(cell => cell.textContent = "");
    };

    const checkWinner = (player, board) => {
        const winningConditions = [
            [1, 5, 9], [1, 4, 7], [3, 6, 9], [4, 5, 6],
            [3, 5, 7], [1, 2, 3], [7, 8, 9], [2, 5, 8]
        ];

        const playerMarks = board
            .filter((cell) => cell.getValue() === player.symbol)
            .map((cell) => cell.index);

        return winningConditions.some((condition) =>
            condition.every(index => playerMarks.includes(index))
        );
    };

    resetButton.addEventListener("click", resetGame);

    return { playGame, resetGame };
})();

gameController.playGame();
