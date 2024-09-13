
const startGame = () => {
const createTile = () => {
        let gridTile = document.createElement('div');
        gridTile.className = 'newTile';

        return gridTile;
}

const createGrid = () => {
    const container = document.querySelector('#container');

    for(let i = 0; i < 256; i++) {
        const div = createTile();
        container.appendChild(div);
    }
}

const colorTile = () => {
}
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
startList.appendChild(startBtn);
resetList.appendChild(resetBtn);
btnList.append(startList,resetList);
wrapper.insertBefore(btnList,container);