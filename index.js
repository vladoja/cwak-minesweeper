const initGameEngine = () => {
    const size = 100;
    const grid = Array.prototype.fill(0, 0, size);


    function createGrid(gridElement) {
        console.log('Creating board: ', gridElement)
        for (let i = 0; i < size; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.id = `square-${i}`;
            gridElement.appendChild(square);
        }

    }


    return {
        createGrid
    }

}


document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom loaded');
    const gameEngine = initGameEngine();
    const gridElement = document.querySelector('#grid');
    gameEngine.createGrid(gridElement);

});