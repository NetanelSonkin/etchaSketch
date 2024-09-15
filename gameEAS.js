let startBtn;
let resetBtn;
let eraseContainer;
let eraseInput;
let eraseLabel;
let eraseSpan;
let eraseSwitchDesc;

// Function to darken the color
const darkenColor = (color, amount) => {
    let r, g, b;
    if (color.startsWith('#')) {
        // Hex color
        const hex = color.slice(1);
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else if (color.startsWith('rgb')) {
        // RGB color
        [r, g, b] = color.match(/\d+/g).map(Number);
    } else {
        throw new Error('Unsupported color format');
    }

    // Apply darkening
    r = Math.max(0, Math.floor(r * (1 - amount)));
    g = Math.max(0, Math.floor(g * (1 - amount)));
    b = Math.max(0, Math.floor(b * (1 - amount)));

    return `rgb(${r}, ${g}, ${b})`;
};

// Function to get a random color from options
const getRandomColor = () => {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    return `rgb(${randomR}, ${randomG}, ${randomB})`;
};

// Function to show custom prompt
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
    boxInput.setAttribute('type', 'number');
    boxInput.setAttribute('id', 'boxInput');
    boxInput.setAttribute('min', '1');
    boxInput.setAttribute('max', '100');

    const colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'colorInput');
    colorLabel.textContent = 'Choose a color:';

    const colorSelect = document.createElement('select');
    colorSelect.setAttribute('id', 'colorInput');

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

    for (const [name, hex] of Object.entries(colorOptions)) {
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
    switchDesc.textContent = 'Fancy Mode';

    switchContainer.appendChild(switchLabel);
    switchContainer.appendChild(switchDesc);

    const darkenSwitchContainer = document.createElement('div');
    darkenSwitchContainer.classList.add('switch-container');

    const darkenSwitchLabel = document.createElement('label');
    darkenSwitchLabel.classList.add('switch');

    const darkenSwitchInput = document.createElement('input');
    darkenSwitchInput.setAttribute('type', 'checkbox');
    const darkenSwitchSpan = document.createElement('span');

    darkenSwitchLabel.appendChild(darkenSwitchInput);
    darkenSwitchLabel.appendChild(darkenSwitchSpan);

    const darkenSwitchDesc = document.createElement('div');
    darkenSwitchDesc.classList.add('switchDesc');
    darkenSwitchDesc.textContent = 'Darken effect';

    darkenSwitchContainer.appendChild(darkenSwitchLabel);
    darkenSwitchContainer.appendChild(darkenSwitchDesc);

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('id', 'submitInput');
    submitBtn.textContent = 'Submit';

    modalContent.append(boxLabel, boxInput, colorLabel, colorSelect, switchContainer, darkenSwitchContainer, submitBtn);
    modal.appendChild(modalContent);
    document.querySelector('#wrapper').appendChild(modal);

    // Toggle behavior for exclusivity of switches
    switchInput.addEventListener('change', () => {
        if (switchInput.checked) {
            darkenSwitchInput.checked = false; // Disable darken if random is checked
        }
    });

    darkenSwitchInput.addEventListener('change', () => {
        if (darkenSwitchInput.checked) {
            switchInput.checked = false; // Disable random if darken is checked
        }
    });

    submitBtn.addEventListener('click', () => {
        const userInput = parseInt(boxInput.value);
        const selectedColor = colorSelect.value;
        const isRandomizeEnabled = switchInput.checked;
        const isDarkenEffectEnabled = darkenSwitchInput.checked;

        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            alert("Invalid input! Please enter a number between 1 and 100.");
            return;
        }

        document.querySelector('#wrapper').removeChild(modal);
        document.querySelector('#wrapper').removeChild(overlay);

        startGame(userInput, selectedColor, isRandomizeEnabled, isDarkenEffectEnabled);
    });
};

let isMouseDown = false;

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

const startGame = (userInput, selectedColor, isRandomizeEnabled, isDarkenEffectEnabled) => {
    startBtn.removeEventListener('click', startGame);
    startBtn.setAttribute('disabled', 'true');
    clearGrid();
    const container = document.querySelector('#container');
    const tileSize = 500 / userInput;

    // Initialize erase color
    const eraseColor = '#f0ffffd9';

    const createTile = () => {
        const gridTile = document.createElement('div');
        gridTile.className = 'newTile';
        gridTile.style.width = `${tileSize}px`;
        gridTile.style.height = `${tileSize}px`;
        gridTile.dataset.interactions = 0; // To track darkening interactions
        return gridTile;
    };

    const createGrid = () => {
        for (let i = 0; i < userInput * userInput; i++) {
            const div = createTile();
            container.appendChild(div);

            div.addEventListener('mousedown', () => {
                if (eraseInput.checked) {
                    // Erase tile if erase switch is enabled
                    div.style.backgroundColor = eraseColor;
                } else {
                    // Apply selected color based on switches
                    applyTileColor(div);
                }
            });
            
            div.addEventListener('mousemove', () => {
                if (isMouseDown) {
                    if (eraseInput.checked) {
                        // Erase tile on mousemove if erase switch is enabled
                        div.style.backgroundColor = eraseColor;
                    } else {
                        // Apply selected color based on switches
                        applyTileColor(div);
                    }
                }
            });
            
            div.addEventListener('mouseleave', () => {
                if (isMouseDown) {
                    if (eraseInput.checked) {
                        // Erase tile on mouseleave if erase switch is enabled
                        div.style.backgroundColor = eraseColor;
                    } else {
                        // Apply selected color based on switches
                        applyTileColor(div);
                    }
                }
            });
        }
    };

    const applyTileColor = (tile) => {
        if (isDarkenEffectEnabled) {
            const interactions = parseInt(tile.dataset.interactions);
            if (interactions < 10) {
                const darkenAmount = 0.1 * (interactions + 1);
                const newColor = darkenColor(selectedColor, darkenAmount);
                tile.style.backgroundColor = newColor;
                tile.dataset.interactions = interactions + 1;
            }
        } else if (isRandomizeEnabled) {
            tile.style.backgroundColor = getRandomColor();
        } else {
            tile.style.backgroundColor = selectedColor;
        }
    };

    createGrid();
};

const clearGrid = () => {
    console.log('Clearing grid...'); // Debug statement
    const container = document.querySelector('#container');
    container.innerHTML = '';
};

const resetGame = () => {
    showCustomPrompt();
    startBtn.removeAttribute('disabled');
    eraseInput.checked = false; // Ensure this doesn't trigger unexpected behavior
};



document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector("#wrapper");
    const container = document.querySelector('#container');
    const header = document.querySelector('#header');

    // Create and style the buttons
    const btnList = document.createElement("ul");
    const startList = document.createElement("li");
    const resetList = document.createElement("li");
    eraseContainer = document.createElement("li");
    startBtn = document.createElement("button");  // Initialize globally declared startBtn
    resetBtn = document.createElement("button");  // Initialize resetBtn
    startBtn.setAttribute("class", "startGame");
    resetBtn.setAttribute("class", "resetGame");
    startBtn.textContent = "Start Game!";
    resetBtn.textContent = "Reset";
    
    eraseContainer.classList.add('switch-container');

    eraseLabel = document.createElement('label');
    eraseLabel.classList.add('switch');

    eraseInput = document.createElement('input');
    eraseInput.setAttribute('type', 'checkbox');
    eraseSpan = document.createElement('span');

    eraseLabel.appendChild(eraseInput);
    eraseLabel.appendChild(eraseSpan);

    eraseSwitchDesc = document.createElement('div');
    eraseSwitchDesc.classList.add('eraseSwitchDesc');
    eraseSwitchDesc.textContent = 'Erase Switch';

    eraseContainer.appendChild(eraseSwitchDesc);
    eraseContainer.appendChild(eraseLabel);
    
    startList.appendChild(startBtn);
    resetList.appendChild(resetBtn);
    btnList.setAttribute("class", "btnList");
    btnList.append(eraseContainer, startList, resetList);

    // Create and add the instructions
    const instructions = document.createElement('div');
    instructions.setAttribute('class', 'instructions');
    instructions.textContent = "Hold mouse button in order to color the tiles.";
    
    // Append elements to the DOM
    if (wrapper && container) {
        wrapper.insertBefore(btnList, container);
    } else {
        console.error('Wrapper or container not found');
    }

    if (header) {
        header.appendChild(instructions);
    } else {
        console.error('Header element not found');
    }

    eraseInput.addEventListener('change', () => {
        const isEraseEnabled = eraseInput.checked;
        const tiles = document.querySelectorAll('.newTile');
        
        tiles.forEach(tile => {
            if (isEraseEnabled) {
                tile.style.backgroundColor = '#f0ffffd9';
            } else {
                // Reapply the color based on current state
                const interactions = parseInt(tile.dataset.interactions);
                if (isDarkenEffectEnabled && interactions < 10) {
                    const darkenAmount = 0.1 * (interactions + 1);
                    tile.style.backgroundColor = darkenColor(selectedColor, darkenAmount);
                } else if (isRandomizeEnabled) {
                    tile.style.backgroundColor = getRandomColor();
                } else {
                    tile.style.backgroundColor = selectedColor;
                }
            }
        });
    });
    
    // Event listeners for buttons
    startBtn.addEventListener('click', showCustomPrompt);
    resetBtn.addEventListener('click', resetGame);
});