const showCustomPrompt = () => {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.querySelector('#wrapper').appendChild(overlay);

    const modal = document.createElement('div');
    modal.classList.add('custom-modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const boxLabel = document.createElement('label');
    boxLabel.setAttribute('for', 'boxInput');
    boxLabel.textContent = "Enter the number of tiles in a row (1-100):";

    const boxInput = document.createElement('input');
    boxInput.setAttribute('type','number');
    boxInput.setAttribute('id','boxInput');
    boxInput.setAttribute('min','1');
    boxInput.setAttribute('max','100');

    const colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'colorInput');
    colorLabel.textContent = 'Choose a color:';

    const colorSelect = document.createElement('select');
    colorSelect.setAttribute('id','colorInput')

    const colorOptions = {
        'Aqua': '#00FFFF',
        'Red': '#FF0000',
        'Maroon': '#800000',
        'Black': '#000000',
        'Blue': '#0000FF',
        'Green': '#008000',
        'Yellow': '#FFFF00',
        'Peach': '#d68874',
        'Rose': '#D7707E',
        'Purple': '#b67fdd',
        'Fuchsia': '#FF00FF',
        'Lime': '#00FF00',
        'Orange': '#FFA500'
    };

    for(const [name, hex] of Object.entries(colorOptions)) {
        const option = document.createElement('option');
        option.setAttribute('value', hex);
        option.textContent = name;
        colorSelect.appendChild(option);
    }
    

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('id', 'submitInput');
    submitBtn.textContent = 'Submit';

    modalContent.append(boxLabel, boxInput, colorLabel, colorSelect, submitBtn);
    modal.appendChild(modalContent); // Ensure modalContent is appended to modal
    document.querySelector('#wrapper').appendChild(modal);

    submitBtn.addEventListener('click', () => {
        const userInput = parseInt(boxInput.value);
        const selectedColor = colorSelect.value;

        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            alert("Invalid input! Please enter a number between 1 and 100.");
            return;
        }

        document.querySelector('#wrapper').removeChild(modal);
        document.querySelector('#wrapper').removeChild(overlay);

        startGame(userInput, selectedColor);
    });
};

let isMouseDown = false;

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

const startGame = (userInput, selectedColor) => {
    startBtn.removeEventListener('click', startGame);
    startBtn.setAttribute('disabled', 'true');
    clearGrid();
 
    const container = document.querySelector('#container');
    const tileSize = 500 / userInput;

    const createTile = () => {
            const gridTile = document.createElement('div');
            gridTile.className = 'newTile';
            gridTile.style.width = `${tileSize}px`;
            gridTile.style.height = `${tileSize}px`;
            return gridTile;
    }

    

    const createGrid = () => {
        for(let i = 0; i < userInput * userInput; i++) {
            const div = createTile();
            container.appendChild(div);
            div.addEventListener('mousedown', () => {
                div.style.backgroundColor = selectedColor;
            });

            div.addEventListener('mousemove', () => {
                if (isMouseDown) {
                    div.style.backgroundColor = selectedColor;
                }
            });
        }
        
    }
    createGrid();
}

const clearGrid = () => {
    const container = document.querySelector('#container');
    container.innerHTML = '';
}


const resetGame = () => {
    showCustomPrompt();
    startBtn.removeAttribute('disabled');
}

const wrapper = document.querySelector("#wrapper");
const btnList = document.createElement("ul");
const startList = document.createElement("li");
const resetList = document.createElement("li");
const startBtn = document.createElement("button");
const resetBtn = document.createElement("button");
const instructions = document.createElement('div');
instructions.setAttribute('class', 'instructions');
instructions.textContent = "Hold mouse button in order to color the tiles.";

startBtn.setAttribute("class", "startGame");
resetBtn.setAttribute("class", "resetGame");
startBtn.textContent = "Start Game!";
resetBtn.textContent = "Reset";
btnList.setAttribute("class", "btnList");
startList.appendChild(startBtn);
resetList.appendChild(resetBtn);
btnList.append(startList,resetList);
header.appendChild(instructions);
wrapper.insertBefore(btnList, document.querySelector('#container'));

startBtn.addEventListener('click', showCustomPrompt);
resetBtn.addEventListener('click', resetGame);