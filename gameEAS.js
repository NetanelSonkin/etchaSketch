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

    const switchContainer = document.createElement('div');
    switchContainer.classList.add('switch-container');

    const switchLabel = document.createElement('label');
    switchLabel.classList.add('switch');

    const switchInput = document.createElement('input');
    switchInput.setAttribute('type', 'checkbox');
    const switchSpan = document.createElement('span');

    switchLabel.appendChild(switchInput);
    switchLabel.appendChild(switchSpan);

    const switchDesc = document.createElement('div');
    switchDesc.classList.add('switchDesc');
    switchDesc.textContent = 'toggle to make it fancy';

    switchContainer.appendChild(switchLabel);
    switchContainer.appendChild(switchDesc);

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('id', 'submitInput');
    submitBtn.textContent = 'Submit';

    modalContent.append(boxLabel, boxInput, colorLabel, colorSelect, switchContainer, submitBtn);
    modal.appendChild(modalContent); // Ensure modalContent is appended to modal
    document.querySelector('#wrapper').appendChild(modal);

    submitBtn.addEventListener('click', () => {
        const userInput = parseInt(boxInput.value);
        const selectedColor = colorSelect.value;
        const isAnimationEnabled = switchInput.checked;

        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            alert("Invalid input! Please enter a number between 1 and 100.");
            return;
        }

        document.querySelector('#wrapper').removeChild(modal);
        document.querySelector('#wrapper').removeChild(overlay);

        startGame(userInput, selectedColor, isAnimationEnabled);
    });
};

const getRandomColor = (colorOptions) => {
    const colors = Object.values(colorOptions);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

let isMouseDown = false;

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});



const startGame = (userInput, selectedColor, isAnimationEnabled) => {
    startBtn.removeEventListener('click', startGame);
    startBtn.setAttribute('disabled', 'true');
    clearGrid();
 
    const container = document.querySelector('#container');
    const tileSize = 500 / userInput;

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

    const createTile = () => {
            const gridTile = document.createElement('div');
            gridTile.className = 'newTile';
            gridTile.style.width = `${tileSize}px`;
            gridTile.style.height = `${tileSize}px`;
            gridTile.dataset.interactions = 0;
            return gridTile;
    }

    const handleTileInteraction = (div, selectedColor, isAnimationEnabled) => {
        div.addEventListener('mousedown', () => {
            div.style.backgroundColor = selectedColor;
            div.dataset.interactions = parseInt(div.dataset.interactions) + 1;
            applyDarkeningEffect(div);
        });
    
        div.addEventListener('mousemove', () => {
            if (isMouseDown) {
                div.style.backgroundColor = selectedColor;
                div.dataset.interactions = parseInt(div.dataset.interactions) + 1;
                applyDarkeningEffect(div);
            }
        });
    
        div.addEventListener('mouseleave', () => {
            if (isAnimationEnabled) {
                div.style.backgroundColor = getRandomColor(colorOptions);
            }
        });
    }
    
    const applyDarkeningEffect = (div) => {
        const interactions = parseInt(div.dataset.interactions);
        const maxInteractions = 10; // Total interactions for full darkening
    
        // Calculate the darkening percentage
        const darkeningFactor = interactions / maxInteractions;
        const originalColor = getComputedStyle(div).backgroundColor;
    
        // Convert original color to RGB if necessary
        const rgbColor = originalColor.match(/\d+/g);
        if (rgbColor) {
            let [r, g, b] = rgbColor.map(Number);
    
            // Darken the color
            r = Math.max(0, Math.floor(r * (1 - darkeningFactor)));
            g = Math.max(0, Math.floor(g * (1 - darkeningFactor)));
            b = Math.max(0, Math.floor(b * (1 - darkeningFactor)));
    
            div.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    }

    const createGrid = () => {
        for(let i = 0; i < userInput * userInput; i++) {
            const div = createTile();
            container.appendChild(div);
            handleTileInteraction(div, selectedColor, isAnimationEnabled);
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
const header = document.querySelector('#header');
header.appendChild(instructions);
wrapper.insertBefore(btnList, document.querySelector('#container'));

startBtn.addEventListener('click', showCustomPrompt);
resetBtn.addEventListener('click', resetGame);