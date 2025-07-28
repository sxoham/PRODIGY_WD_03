function getAIMove(board, level) {
    if (level === "easy") {
        return getRandomMove(board);
    } else if (level === "medium") {
        return Math.random() < 0.5 ? getRandomMove(board) : minimaxMove(board, "O").index;
    } else {
        return minimaxMove(board, "O").index;
    }
}


function getRandomMove(board) {
    const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function minimaxMove(board, player) {
    const opponent = player === "O" ? "X" : "O";
    const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWinner(board, "X")) return { score: -10 };
    if (checkWinner(board, "O")) return { score: 10 };
    if (empty.length === 0) return { score: 0 };

    let moves = [];

    for (let i of empty) {
        board[i] = player;
        const result = minimaxMove(board, opponent);
        board[i] = "";
        moves.push({ index: i, score: result.score });
    }

    if (player === "O") {
        // AI is maximizing
        return moves.reduce((best, move) => move.score > best.score ? move : best);
    } else {
        // Player is minimizing
        return moves.reduce((best, move) => move.score < best.score ? move : best);
    }
}


function checkWinner(b, p) {
    const win = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return win.some(combo => combo.every(i => b[i] === p));
}
