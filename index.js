const initGameEngine = () => {
    const size = 100;
    const bombsAmount = 12;
    const grid = [];
    const bombsArray = Array(bombsAmount).fill('bomb');
    const emptyArray = Array(size - bombsAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = shuffle(gameArray);

    console.log(shuffledArray);

    /**
     * Shuffles array in place with
     * the modern version of the Fisher–Yates shuffle algorithm.
     * @param {Array} a items An array containing the items.
     */
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }


    function createBoard(gridElement) {
        console.log('Creating board: ', gridElement);
        for (let i = 0; i < size; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add(shuffledArray[i]);
            square.id = `square-${i}`;
            square.innerHTML = '' + i;

            gridElement.appendChild(square);
            grid.push(square);

            square.addEventListener('click', e => {
                console.log(`Clicked on square ${e.target.id}`, e);
            })
        }
    }


    function placeBombs() {
        bombsArray.fill()
        Array
        bombsArray.fill()
    }


    function getNeighbors(id) {

    }


    return {
        createBoard
    }

}


document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom loaded');
    const gameEngine = initGameEngine();
    const gridElement = document.querySelector('#grid');
    gameEngine.createBoard(gridElement);

});