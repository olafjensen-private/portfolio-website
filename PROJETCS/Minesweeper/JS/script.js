const rows = 8;
const cols = 8;
const minesCount = 10;
let cells = [];
let mineLocations = [];
let revealedCount = 0;
let flagsLeft = minesCount;
let gameOver = false;

const mineCountElem = document.getElementById('mine-count');
const resetButton = document.getElementById('reset-btn');
const gameBoard = document.getElementById('game-board');

function initGame() {
    gameOver = false;
    revealedCount = 0;
    flagsLeft = minesCount;
    mineLocations = [];
    cells = [];
    
    gameBoard.innerHTML = '';
    mineCountElem.textContent = `Mines: ${flagsLeft}`;

    for (let row = 0; row < rows; row++) {
        cells[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            gameBoard.appendChild(cell);
            cells[row].push(cell);

            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
        }
    }

    while (mineLocations.length < minesCount) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);
        const mineLocation = `${randomRow},${randomCol}`;
        
        if (!mineLocations.includes(mineLocation)) {
            mineLocations.push(mineLocation);
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = cells[row][col];
            if (mineLocations.includes(`${row},${col}`)) {
                cell.dataset.isMine = 'true';
            } else {
                let mineCount = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const r = row + i;
                        const c = col + j;
                        if (r >= 0 && r < rows && c >= 0 && c < cols && mineLocations.includes(`${r},${c}`)) {
                            mineCount++;
                        }
                    }
                }
                cell.dataset.mineCount = mineCount;
            }
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (cell.classList.contains('opened') || cell.classList.contains('flag')) return;

    if (cell.dataset.isMine) {
        revealMines();
        cell.classList.add('bomb');
        gameOver = true;
        alert('Game Over! You hit a mine.');
    } else {
        revealCell(row, col);
    }
}

function handleCellRightClick(event) {
    event.preventDefault();
    if (gameOver) return;

    const cell = event.target;
    if (cell.classList.contains('opened')) return;

    if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        flagsLeft++;
    } else {
        if (flagsLeft > 0) {
            cell.classList.add('flag');
            flagsLeft--;
        }
    }

    mineCountElem.textContent = `Mines: ${flagsLeft}`;
}

function revealCell(row, col) {
    const cell = cells[row][col];
    if (cell.classList.contains('opened')) return;

    cell.classList.add('opened');
    revealedCount++;

    const mineCount = cell.dataset.mineCount;
    if (mineCount > 0) {
        cell.textContent = mineCount;
        cell.classList.add(`number${mineCount}`);
    } else {
        cell.classList.add('safe');
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < rows && c >= 0 && c < cols && !cells[r][c].classList.contains('opened')) {
                    revealCell(r, c);
                }
            }
        }
    }

    if (revealedCount === (rows * cols - minesCount)) {
        gameOver = true;
        alert('You win! All safe cells revealed.');
    }
}

function revealMines() {
    mineLocations.forEach(location => {
        const [r, c] = location.split(',').map(Number);
        cells[r][c].classList.add('bomb');
    });
}

resetButton.addEventListener('click', initGame);

window.onload = initGame;
