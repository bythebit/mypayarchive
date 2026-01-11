const canvas = document.getElementById('tetris-board');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const nextPieceCanvas = document.getElementById('next-piece');
const nextPieceContext = nextPieceCanvas.getContext('2d');

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 24;

context.canvas.width = BOARD_WIDTH * BLOCK_SIZE;
context.canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

nextPieceContext.canvas.width = 4 * BLOCK_SIZE;
nextPieceContext.canvas.height = 4 * BLOCK_SIZE;

const TETROMINOES = {
    'I': [[1, 1, 1, 1]],
    'J': [[1, 0, 0], [1, 1, 1]],
    'L': [[0, 0, 1], [1, 1, 1]],
    'O': [[1, 1], [1, 1]],
    'S': [[0, 1, 1], [1, 1, 0]],
    'T': [[0, 1, 0], [1, 1, 1]],
    'Z': [[1, 1, 0], [0, 1, 1]]
};

const COLORS = [
    null,
    '#FF0000', // Red for I
    '#0000FF', // Blue for J
    '#FFA500', // Orange for L
    '#FFFF00', // Yellow for O
    '#00FF00', // Green for S
    '#800080', // Purple for T
    '#FFC0CB'  // Pink for Z
];

const board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

let piece = {
    pos: { x: 0, y: 0 },
    matrix: null,
    color: null
};
 
let score = 0;

function createPiece(type) {
    if (type === 'I') {
        return { matrix: [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]], color: COLORS[1] };
    } else if (type === 'J') {
        return { matrix: [[0,1,0],[0,1,0],[1,1,0]], color: COLORS[2] };
    } else if (type === 'L') {
        return { matrix: [[0,1,0],[0,1,0],[0,1,1]], color: COLORS[3] };
    } else if (type === 'O') {
        return { matrix: [[1,1],[1,1]], color: COLORS[4] };
    } else if (type === 'S') {
        return { matrix: [[0,1,1],[1,1,0],[0,0,0]], color: COLORS[5] };
    } else if (type === 'T') {
        return { matrix: [[0,1,0],[1,1,1],[0,0,0]], color: COLORS[6] };
    } else if (type === 'Z') {
        return { matrix: [[1,1,0],[0,1,1],[0,0,0]], color: COLORS[7] };
    }
}

function drawPiece(matrix, offset, color) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = color;
                context.fillRect((offset.x + x) * BLOCK_SIZE, (offset.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = '#222';
                context.strokeRect((offset.x + x) * BLOCK_SIZE, (offset.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}


function draw() {
    // Clear the board
    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw the grid
    context.strokeStyle = '#808080';
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    // Draw the settled pieces on the board
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = '#222';
                context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });

    // Draw the current falling piece
    if (piece.matrix) {
        drawPiece(piece.matrix, piece.pos, piece.color);
    }
}

function collide(board, piece) {
    for (let y = 0; y < piece.matrix.length; ++y) {
        for (let x = 0; x < piece.matrix[y].length; ++x) {
            if (piece.matrix[y][x] !== 0 &&
                (board[y + piece.pos.y] &&
                board[y + piece.pos.y][x + piece.pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(board, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + piece.pos.y][x + piece.pos.x] = value;
            }
        });
    });
}

function update() {
    draw();
    requestAnimationFrame(update);
}

// Generate the first piece when the game starts
const pieceTypes = 'IJLOSTZ';
piece = createPiece(pieceTypes[pieceTypes.length * Math.random() | 0]);
piece.pos.x = (BOARD_WIDTH / 2 | 0) - (piece.matrix[0].length / 2 | 0);
piece.pos.y = 0;

update();