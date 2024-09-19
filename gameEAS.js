let startBtn;
let resetBtn;
let eraseContainer;
let eraseInput;
let eraseLabel;
let eraseSpan;
let eraseSwitchDesc;
let clearBtn;
let clearGrid;
// Declare global variables to track the state
let isDarkenEffectEnabled = false;
let isRandomizeEnabled = false;
let selectedColor = "#f0ffffd9"; // Default color

// Function to darken the color
const darkenColor = (color, amount) => {
  let r, g, b;
  if (color.startsWith("#")) {
    // Hex color
    const hex = color.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    // RGB color
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    throw new Error("Unsupported color format");
  }

  // Apply darkening
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));

  return `rgb(${r}, ${g}, ${b})`; // Use backticks here
};

// Function to get a random color from options
const getRandomColor = () => {
  const randomR = Math.floor(Math.random() * 256);
  const randomG = Math.floor(Math.random() * 256);
  const randomB = Math.floor(Math.random() * 256);
  return `rgb(${randomR}, ${randomG}, ${randomB})`; // Use backticks here
};

// Function to show custom prompt
const showCustomPrompt = () => {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.querySelector("#wrapper").appendChild(overlay);

  const modal = document.createElement("div");
  modal.classList.add("custom-modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const boxLabel = document.createElement("label");
  boxLabel.setAttribute("for", "boxInput");
  boxLabel.textContent = "Enter the number of tiles in a row (1-100):";

  const boxInput = document.createElement("input");
  boxInput.setAttribute("type", "number");
  boxInput.setAttribute("id", "boxInput");
  boxInput.setAttribute("min", "1");
  boxInput.setAttribute("max", "100");

  const colorLabel = document.createElement("label");
  colorLabel.setAttribute("for", "colorInput");
  colorLabel.textContent = "Choose a color:";

  const colorSelect = document.createElement("select");
  colorSelect.setAttribute("id", "colorInput");

  const colorOptions = {
    Aqua: "#00FFFF",
    Red: "#FF0000",
    Maroon: "#800000",
    Black: "#000000",
    Blue: "#0000FF",
    Green: "#008000",
    Yellow: "#FFFF00",
    Peach: "#d68874",
    Rose: "#D7707E",
    Purple: "#b67fdd",
    Fuchsia: "#FF00FF",
    Lime: "#00FF00",
    Orange: "#FFA500",
  };

  for (const [name, hex] of Object.entries(colorOptions)) {
    const option = document.createElement("option");
    option.setAttribute("value", hex);
    option.textContent = name;
    colorSelect.appendChild(option);
  }

  const switchContainer = document.createElement("div");
  switchContainer.classList.add("switch-container");

  const switchLabel = document.createElement("label");
  switchLabel.classList.add("switch");

  const switchInput = document.createElement("input");
  switchInput.setAttribute("type", "checkbox");
  const switchSpan = document.createElement("span");

  switchLabel.appendChild(switchInput);
  switchLabel.appendChild(switchSpan);

  const switchDesc = document.createElement("div");
  switchDesc.classList.add("switchDesc");
  switchDesc.textContent = "Fancy Mode";

  switchContainer.appendChild(switchLabel);
  switchContainer.appendChild(switchDesc);

  const darkenSwitchContainer = document.createElement("div");
  darkenSwitchContainer.classList.add("switch-container");

  const darkenSwitchLabel = document.createElement("label");
  darkenSwitchLabel.classList.add("switch");

  const darkenSwitchInput = document.createElement("input");
  darkenSwitchInput.setAttribute("type", "checkbox");
  const darkenSwitchSpan = document.createElement("span");

  darkenSwitchLabel.appendChild(darkenSwitchInput);
  darkenSwitchLabel.appendChild(darkenSwitchSpan);

  const darkenSwitchDesc = document.createElement("div");
  darkenSwitchDesc.classList.add("switchDesc");
  darkenSwitchDesc.textContent = "Darken effect";

  darkenSwitchContainer.appendChild(darkenSwitchLabel);
  darkenSwitchContainer.appendChild(darkenSwitchDesc);

  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("class", "submitInput");
  submitBtn.textContent = "Submit";

  modalContent.append(
    boxLabel,
    boxInput,
    colorLabel,
    colorSelect,
    switchContainer,
    darkenSwitchContainer,
    submitBtn
  );
  modal.appendChild(modalContent);
  document.querySelector("#wrapper").appendChild(modal);

  // Toggle behavior for exclusivity of switches
  switchInput.addEventListener("change", () => {
    const colorChangeContainer = document.querySelector(".color-change-container");
    if (switchInput.checked) {
      darkenSwitchInput.checked = false; // Disable darken if random is checked
      colorChangeContainer.style.display = "none"; // Hide color change container
    } else {
      colorChangeContainer.style.display = "flex"; // Show color change container
    }
  });

  darkenSwitchInput.addEventListener("change", () => {
    const colorChangeContainer = document.querySelector(".color-change-container");
    if (darkenSwitchInput.checked) {
      switchInput.checked = false; // Disable random if darken is checked
      colorChangeContainer.style.display = "flex"; // Show color change container
    }
  });

  submitBtn.addEventListener("click", () => {
    const userInput = parseInt(boxInput.value);
    selectedColor = colorSelect.value;
    isRandomizeEnabled = switchInput.checked;
    isDarkenEffectEnabled = darkenSwitchInput.checked;

    if (isNaN(userInput) || userInput < 1 || userInput > 100) {
      alert("Invalid input! Please enter a number between 1 and 100.");
      return;
    }

    document.querySelector("#wrapper").removeChild(modal);
    document.querySelector("#wrapper").removeChild(overlay);

    const colorChangeContainer = document.querySelector(".color-change-container");
    if (!isRandomizeEnabled && !isDarkenEffectEnabled) {
      colorChangeContainer.style.display = "flex"; // Show color change container
    } else if (isDarkenEffectEnabled && !isRandomizeEnabled){
      colorChangeContainer.style.display = "flex";
    }else{
      colorChangeContainer.style.display = "none"; // Hide color change container
    }

    startGame(
      userInput,
      selectedColor,
      isRandomizeEnabled,
      isDarkenEffectEnabled
    );
  });
};

let isMouseDown = false;

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});
document.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const tile = event.target;
    if (tile.classList.contains("newTile")) {
      if (eraseInput.checked) {
        tile.style.backgroundColor = eraseColor;
        tile.dataset.interactions = 0; // Reset interactions when erasing

        // Disable colorChangeContainer when Fancy Mode is enabled
        const colorChangeContainer = document.querySelector(".color-change-container");
        const colorChangeLabel = document.querySelector("label[for='colorChangeInput']");
        const colorChangeSelect = document.querySelector("#colorChangeInput");

        if (!isRandomizeEnabled && !isDarkenEffectEnabled) {
            colorChangeContainer.style.display = "flex"; // Show color change container
            colorChangeLabel.style.display = "flex"; // Ensure the label is shown
            colorChangeSelect.style.display = "flex"; // Ensure the select is shown
            colorChangeLabel.style.display = "flex"; // Ensure the label is shown
            colorChangeSelect.style.display = "flex"; // Ensure the select is shown
        } else if (isDarkenEffectEnabled) {
          colorChangeContainer.style.display = "flex"; // Show color change container
        } else {
          colorChangeContainer.style.display = "none"; // Hide color change container
        }
        if (!isRandomizeEnabled && !isDarkenEffectEnabled) {
            colorChangeContainer.style.display = "flex"; // Show color change container
        } else {
            colorChangeContainer.style.display = "none"; // Hide color change container
        }

        // Ensure color change container is shown when reset and fancy mode is off
        if (!isRandomizeEnabled && !isDarkenEffectEnabled) {
            colorChangeContainer.style.display = "flex"; // Show color change container
        }
        resetBtn.addEventListener("click", () => {
            if (!isRandomizeEnabled && !isDarkenEffectEnabled) {
            colorChangeContainer.style.display = "flex"; // Show color change container
            }
        });
        if (isRandomizeEnabled) {
            if (colorChangeLabel && colorChangeLabel.parentNode === colorChangeContainer) {
          colorChangeContainer.removeChild(colorChangeLabel);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
          colorChangeContainer.removeChild(colorChangeSelect);
            }
        } else {
            if (!colorChangeContainer.contains(colorChangeLabel)) {
          colorChangeContainer.appendChild(colorChangeLabel);
            }
            if (!colorChangeContainer.contains(colorChangeSelect)) {
          colorChangeContainer.appendChild(colorChangeSelect);
            }
        }
        if (!isRandomizeEnabled) {
            selectedColor = document.querySelector("#colorChangeInput").value;
        }
        if (!isRandomizeEnabled && !isDarkenEffectEnabled) {
            colorChangeContainer.style.display = "flex"; // Show color change container
        }
        if (isRandomizeEnabled) {
            if (colorChangeLabel && colorChangeLabel.parentNode === colorChangeContainer) {
                colorChangeContainer.removeChild(colorChangeLabel);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeSelect);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeSelect);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeSelect);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeSelect);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeSelect);
            }
            if (colorChangeLabel && colorChangeLabel.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeLabel);
            }
            if (colorChangeLabel && colorChangeLabel.parentNode === colorChangeContainer) {
              colorChangeContainer.removeChild(colorChangeLabel);
            }
            if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
            colorChangeContainer.removeChild(colorChangeSelect);
            }
          if (colorChangeSelect && colorChangeSelect.parentNode === colorChangeContainer) {
            colorChangeContainer.removeChild(colorChangeSelect);
          }
        }
        if (!isRandomizeEnabled) {
          selectedColor = document.querySelector("#colorChangeInput").value;
        }
      } else {
        if (isDarkenEffectEnabled) {
          const currentColor = tile.style.backgroundColor && tile.style.backgroundColor !== eraseColor ? tile.style.backgroundColor : selectedColor;
          let interactions = parseInt(tile.dataset.interactions) || 0;
          if (currentColor === eraseColor || currentColor === "") {
            tile.style.backgroundColor = selectedColor;
            tile.dataset.interactions = 1;
          } else {
            if (interactions === 0) {
              tile.style.backgroundColor = selectedColor;
              tile.dataset.interactions = 1;
            } else {
              tile.style.backgroundColor = darkenColor(currentColor, 0.1);
              tile.dataset.interactions = interactions + 1;
            }
          }
        } else {
          applyTileColor(tile);
        }
      }
    }
  }
});
document.addEventListener("mouseup", () => {
  isMouseDown = false;
});


const eraseColor = "#f0ffffd9"; // Moved outside the startGame function

document.addEventListener("DOMContentLoaded", () => {
  // ... other code ...

  clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Grid';
  clearBtn.setAttribute('class', 'clear-button');

  // ... other code ...

  clearBtn.addEventListener('click', () => {
    console.log('Clear button clicked');
    document.querySelectorAll('.newTile').forEach(tile => {
      tile.style.backgroundColor = eraseColor;  // Apply the erase color if needed
      tile.dataset.interactions = 0; // Reset interactions when clearing

      // Reattach event listeners
      tile.addEventListener("mousedown", () => {
        if (eraseInput.checked) {
          tile.style.backgroundColor = eraseColor;
          tile.dataset.interactions = 0; // Reset interactions when erasing
        } else {
          if (isDarkenEffectEnabled) {
            tile.style.backgroundColor = selectedColor; // Apply the selected color first
            tile.dataset.interactions = 0; // Reset interactions when darken mode is enabled
          } else {
            applyTileColor(tile);
          }
        }
      });

      tile.addEventListener("mousemove", () => {
        if (isMouseDown) {
          if (eraseInput.checked) {
            tile.style.backgroundColor = eraseColor;
            tile.dataset.interactions = 0; // Reset interactions when erasing
          } else {
            applyTileColor(tile);
          }
        }
      });

      tile.addEventListener("mouseleave", () => {
        if (isMouseDown) {
          if (eraseInput.checked) {
            tile.style.backgroundColor = eraseColor;
            tile.dataset.interactions = 0; // Reset interactions when erasing
          } else {
            applyTileColor(tile);
          }
        }
      });
    });
  });

  // ... other code ...
});
const applyTileColor = (tile) => {
  if (isRandomizeEnabled) {
    tile.style.backgroundColor = getRandomColor();
  } else if (isDarkenEffectEnabled) {
    const currentColor = tile.style.backgroundColor && tile.style.backgroundColor !== eraseColor ? tile.style.backgroundColor : selectedColor;
    let interactions = parseInt(tile.dataset.interactions) || 0;
    if (currentColor === eraseColor || currentColor === "") {
      tile.style.backgroundColor = selectedColor;
      tile.dataset.interactions = 1;
    } else {
      if (interactions === 0) {
        tile.style.backgroundColor = selectedColor;
        tile.dataset.interactions = 1;
      } else {
        tile.style.backgroundColor = darkenColor(currentColor, 0.1);
        tile.dataset.interactions = interactions + 1;
      }
    }
  } else {
    tile.style.backgroundColor = selectedColor;
    tile.dataset.interactions = 0; // Reset interactions when not in darken mode
  }
};

const startGame = (
  userInput,
  selectedColor,
  isRandomizeEnabled,
  isDarkenEffectEnabled
) => {
  startBtn.removeEventListener("click", startGame);
  startBtn.setAttribute("disabled", "true");
  resetGrid(); // Clears the previous grid
  const container = document.querySelector("#container");
  const tileSize = 500 / userInput;

  const createTile = () => {
    const gridTile = document.createElement("div");
    gridTile.className = "newTile";
    gridTile.style.width = `${tileSize}px`; // Use backticks here
    gridTile.style.height = `${tileSize}px`; // Use backticks here
    gridTile.dataset.interactions = 0;
    return gridTile;
  };

  const createGrid = () => {
    for (let i = 0; i < userInput * userInput; i++) {
      const div = createTile();
      container.appendChild(div);

      div.addEventListener("mousedown", () => {
        if (eraseInput.checked) {
          div.style.backgroundColor = eraseColor;
          div.dataset.interactions = 0; // Reset interactions when erasing
        } else {
          applyTileColor(div);
        }
      });

      div.addEventListener("mousemove", () => {
        if (isMouseDown) {
          if (eraseInput.checked) {
            div.style.backgroundColor = eraseColor;
            div.dataset.interactions = 0; // Reset interactions when erasing
          } else {
            applyTileColor(div);
          }
        }
      });

      div.addEventListener("mouseleave", () => {
        if (isMouseDown) {
          if (eraseInput.checked) {
            div.style.backgroundColor = eraseColor;
            div.dataset.interactions = 0; // Reset interactions when erasing
          } else {
            applyTileColor(div);
          }
        }
      });
    }
  };

  createGrid();
};

const resetGrid = () => {
  const container = document.querySelector("#container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

const resetGame = () => {
  showCustomPrompt();
  startBtn.removeAttribute("disabled");
  eraseInput.checked = false; // Ensure this doesn't trigger unexpected behavior
};

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector("#wrapper");
  const container = document.querySelector("#container");
  const header = document.querySelector("#header");

  // Create and style the buttons
  const btnList = document.createElement("ul");
  const startListItem = document.createElement("li");
  const resetListItem = document.createElement("li");
  eraseContainer = document.createElement("li");
  startBtn = document.createElement("button"); // Initialize globally declared startBtn
  resetBtn = document.createElement("button"); // Initialize resetBtn
  startBtn.setAttribute("class", "startGame");
  resetBtn.setAttribute("class", "resetGame");
  startBtn.textContent = "Start Game!";
  resetBtn.textContent = "Reset";

  eraseContainer.classList.add("switch-container");

  eraseLabel = document.createElement("label");
  eraseLabel.classList.add("switch");

  eraseInput = document.createElement("input");
  eraseInput.setAttribute("type", "checkbox");
  eraseSpan = document.createElement("span");

  eraseLabel.appendChild(eraseInput);
  eraseLabel.appendChild(eraseSpan);

  eraseSwitchDesc = document.createElement("div");
  eraseSwitchDesc.classList.add("eraseSwitchDesc");
  eraseSwitchDesc.textContent = "Erase Switch";

  eraseContainer.appendChild(eraseSwitchDesc);
  eraseContainer.appendChild(eraseLabel);

  const clearListItem = document.createElement('li');
  clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Grid';
  clearBtn.setAttribute('class', 'clear-button');

  startListItem.appendChild(startBtn);
  resetListItem.appendChild(resetBtn);
  clearListItem.appendChild(clearBtn);
  btnList.setAttribute("class", "btnList");
  btnList.append(eraseContainer, startListItem, resetListItem, clearListItem);

  // Create and add the instructions
  const instructions = document.createElement("div");
  instructions.setAttribute("class", "instructions");
  instructions.textContent = "Hold mouse button in order to color the tiles.";

  // Append elements to the DOM
  if (wrapper && container) {
    wrapper.insertBefore(btnList, container);
  } else {
    console.error("Wrapper or container not found");
  }

  if (header) {
    header.appendChild(instructions);
  } else {
    console.error("Header element not found");
  }

  // Add color change dropdown
  const colorChangeContainer = document.createElement("div");
  colorChangeContainer.classList.add("color-change-container");

  const colorChangeLabel = document.createElement("label");
  colorChangeLabel.setAttribute("for", "colorChangeInput");
  colorChangeLabel.textContent = "Change color:";

  const colorChangeSelect = document.createElement("select");
  colorChangeSelect.setAttribute("id", "colorChangeInput");
  colorChangeSelect.addEventListener("change", (event) => {
    selectedColor = event.target.value;
    colorChangeSelect.style.backgroundColor = selectedColor;

    // Determine if the color is dark or light
    const rgb = selectedColor.match(/\w\w/g).map((c) => parseInt(c, 16));
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    // Set text color based on brightness
    colorChangeSelect.style.color = brightness < 128 ? "white" : "black";
  });

  const colorOptions = {
    Aqua: "#00FFFF",
    Red: "#FF0000",
    Maroon: "#800000",
    Black: "#000000",
    Blue: "#0000FF",
    Green: "#008000",
    Yellow: "#FFFF00",
    Peach: "#d68874",
    Rose: "#D7707E",
    Purple: "#b67fdd",
    Fuchsia: "#FF00FF",
    Lime: "#00FF00",
    Orange: "#FFA500",
  };

  for (const [name, hex] of Object.entries(colorOptions)) {
    const option = document.createElement("option");
    option.setAttribute("value", hex);
    option.textContent = name;
    colorChangeSelect.appendChild(option);
    if (hex === selectedColor) {
      option.selected = true;
    }
  }

  colorChangeContainer.appendChild(colorChangeLabel);
  colorChangeContainer.appendChild(colorChangeSelect);
  wrapper.insertBefore(colorChangeContainer, container);

  // Event listener for color change
  colorChangeSelect.addEventListener("change", (event) => {
    selectedColor = event.target.value;
    colorChangeSelect.style.backgroundColor = selectedColor;

    // Determine if the color is dark or light
    const rgb = selectedColor.match(/\w\w/g).map((c) => parseInt(c, 16));
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    // Set text color based on brightness
    colorChangeSelect.style.color = brightness < 128 ? "white" : "black";
  });

  eraseInput.addEventListener("change", () => {
    const isEraseEnabled = eraseInput.checked;
    const tiles = document.querySelectorAll(".newTile");
  });

  clearBtn.addEventListener('click', () => {
      console.log('Clear button clicked');
      document.querySelectorAll('.newTile').forEach(tile => {
          tile.style.backgroundColor = eraseColor;  // Apply the erase color if needed
          tile.dataset.interactions = 0; // Reset interactions when clearing
  
          // Reattach event listeners
          tile.addEventListener("mousedown", () => {
              if (eraseInput.checked) {
                  tile.style.backgroundColor = eraseColor;
                  tile.dataset.interactions = 0; // Reset interactions when erasing
              } else {
                  if (isDarkenEffectEnabled) {
                      tile.style.backgroundColor = selectedColor; // Apply the selected color first
                  } else {
                      applyTileColor(tile);
                  }
              }
          });
  
          tile.addEventListener("mousemove", () => {
              if (isMouseDown) {
                  if (eraseInput.checked) {
                      tile.style.backgroundColor = eraseColor;
                      tile.dataset.interactions = 0; // Reset interactions when erasing
                  } else {
                      applyTileColor(tile);
                  }
              }
          });
  
          tile.addEventListener("mouseleave", () => {
              if (isMouseDown) {
                  if (eraseInput.checked) {
                      tile.style.backgroundColor = eraseColor;
                      tile.dataset.interactions = 0; // Reset interactions when erasing
                  } else {
                      applyTileColor(tile);
                  }
              }
          });
      });
  });

  // Event listeners for buttons
  startBtn.addEventListener("click", showCustomPrompt);
  resetBtn.addEventListener("click", resetGame);

  // Create the modal
  // createModal(); // Removed as it is not defined
});