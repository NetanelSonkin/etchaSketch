const createDiv = () => {
        let gridDiv = document.createElement('div');
        gridDiv.className = 'newDiv';

        return gridDiv;
}

const createGrid = () => {
    const container = document.querySelector('#container');

    for(let i = 0; i < 256; i++) {
        const div = createDiv();
        container.appendChild(div);
    }
}

window.onload = createGrid;