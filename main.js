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
}

function update() {
    draw();
    requestAnimationFrame(update);
}

update();