let board = ["", "", "", "", "", "", "", "", ""];
let moveHistory = [];
let currentPlayer = "X";
let gameActive = false;
let gameMode;

let playerScore = 0;
let aiScore = 0;
let drawScore = 0;

const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("status");
const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");

const playerScoreSpan = document.getElementById("playerScore");
const aiScoreSpan = document.getElementById("aiScore");
const drawScoreSpan = document.getElementById("drawScore");

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
});

function startGame(mode) {
    gameMode = mode;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    restartGame();
}

function returnToMenu() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
}

function restartGame() {
    document.getElementById("win-line").style.transform = "scaleX(0)";
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    moveHistory = [];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
    statusDisplay.textContent = `Turn: ${currentPlayer}`;

    if (gameMode === "ai" && currentPlayer === "O") {
        const aiMove = getBestMove();
        if (aiMove !== null) {
            makeMove(aiMove, "O");
            clickSound.play();
            checkGameOver("O");
        }
    }
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.getAttribute("data-index");
        if (board[index] !== "" || !gameActive) return;

        makeMove(index, currentPlayer);
        clickSound.currentTime = 0;
        clickSound.play();

        if (checkGameOver(currentPlayer)) return;

        if (gameMode === "ai" && currentPlayer === "X") {
            setTimeout(() => {
                const aiMove = getBestMove();
                if (aiMove !== null && gameActive) {
                    makeMove(aiMove, "O");
                    clickSound.currentTime = 0;
                    clickSound.play();

                    checkGameOver("O");
                }
            }, 300);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusDisplay.textContent = `Turn: ${currentPlayer}`;
        }
    });
});

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    moveHistory.push({ index: Number(index), player });
}

function checkGameOver(player) {
    const winCombo = checkWin(player);
    if (winCombo) {
        gameActive = false;
        statusDisplay.textContent = `${player} wins! 🎉`;
        winSound.play();
        highlightWin(winCombo);
        if (player === "X") {
            playerScore++;
            playerScoreSpan.textContent = playerScore;
        } else {
            aiScore++;
            aiScoreSpan.textContent = aiScore;
        }
        return true;
    } else if (board.every(cell => cell !== "")) {
        gameActive = false;
        statusDisplay.textContent = "It's a draw!";
        drawScore++;
        drawScoreSpan.textContent = drawScore;

        const drawSound = document.getElementById("draw-sound");
        drawSound.currentTime = 0;
        drawSound.play();

        return true;
    }

}

function getBestMove() {
    const aiLevel = localStorage.getItem("aiLevel") || "easy";
    return getAIMove([...board], aiLevel); // Deep copy of board
}


function checkWin(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winConditions) {
        if (combo.every(i => board[i] === player)) return combo;
    }
    return null;
}

function highlightWin(combo) {
    combo.forEach(index => {
        cells[index].classList.add("win");
    });

    drawWinLine(combo);
}

function drawWinLine(combo) {
    const line = document.getElementById("win-line");

    const winPositions = {
        "0,1,2": { top: 50, left: 0, width: 300, angle: 0 },      // Row 1
        "3,4,5": { top: 150, left: 0, width: 300, angle: 0 },     // Row 2
        "6,7,8": { top: 250, left: 0, width: 300, angle: 0 },     // Row 3
        "0,3,6": { top: 0, left: 50, width: 300, angle: 90 },     // Col 1
        "1,4,7": { top: 0, left: 150, width: 300, angle: 90 },    // Col 2
        "2,5,8": { top: 0, left: 250, width: 300, angle: 90 },    // Col 3
        "0,4,8": { top: 0, left: 0, width: 424.26, angle: 45 },   // Diagonal TL-BR
        "2,4,6": { top: 0, left: 0, width: 424.26, angle: -45 },  // Diagonal TR-BL
    };

    const key = combo.slice().sort((a, b) => a - b).join(',');
    const pos = winPositions[key];

    if (!pos) return;

    line.style.top = `${pos.top}px`;
    line.style.left = `${pos.left}px`;
    line.style.width = `${pos.width}px`;
    line.style.transform = `rotate(${pos.angle}deg) scaleX(1)`;
}

function undoMove() {
    if (!gameActive || moveHistory.length === 0) return;

    const movesToUndo = gameMode === "ai" ? 2 : 1;

    for (let i = 0; i < movesToUndo; i++) {
        const last = moveHistory.pop();
        if (last) {
            board[last.index] = "";
            cells[last.index].textContent = "";
        }
    }

    document.getElementById("win-line").style.transform = "scaleX(0)";
    gameActive = true;

    currentPlayer = "X";
    if (moveHistory.length > 0) {
        currentPlayer = moveHistory[moveHistory.length - 1].player === "X" ? "O" : "X";
    }

    statusDisplay.textContent = `Turn: ${currentPlayer}`;
}

function goHome() {
    window.location.href = "index.html";
}

document.body.classList.add("dark");

document.addEventListener("DOMContentLoaded", () => {
    gameMode = localStorage.getItem("mode") || "pvp";
    restartGame();
});

