
const startGame = (event) => {
    startBtn.removeEventListener('click', startGame);
    clearGrid();

    let userInput = (prompt("Please Enter the number of boxes you want in a row between numbers 1 and 100: ", "0"));
    let gridTile;
    const createTile = () => {
            gridTile = document.createElement('div');
            gridTile.className = 'newTile';

            return gridTile;
    }

    const createGrid = () => {
        const container = document.querySelector('#container');

        for(let i = 0; i < 256; i++) {
            const div = createTile();
            container.appendChild(div);
            div.addEventListener('mouseenter', () => {
            div.style.backgroundColor = 'aqua';
            });
        }
        
    }
    createGrid();
}

const clearGrid = () => {
    const container = document.querySelector('#container');
    const tiles = container.querySelectorAll('.newTile');
    tiles.forEach(tile => tile.remove());
}

const resetGame = () => {
    startGame();
}

const wrapper = document.querySelector("#wrapper");
const btnList = document.createElement("ul");
const startList = document.createElement("li");
const resetList = document.createElement("li");
const startBtn = document.createElement("button");
const resetBtn = document.createElement("button");

startBtn.setAttribute("class", "startGame");
resetBtn.setAttribute("class", "resetGame");
startBtn.textContent = "Start Game!";
resetBtn.textContent = "Reset";
btnList.setAttribute("class", "btnList");
startList.appendChild(startBtn);
resetList.appendChild(resetBtn);
btnList.append(startList,resetList);
wrapper.insertBefore(btnList,container);

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);