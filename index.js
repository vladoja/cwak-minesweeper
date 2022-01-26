const initGameEngine = () => {
    const rows = 10;
    const columns = 10;
    const size = rows * columns;
    const bombsAmount = 12;
    const board = [];
    const transformationTable = {
        board: []
    };
    const surroundings = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];


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


    function createBoard(boardElement) {
        console.log('Creating board: ', boardElement);
        for (let i = 0; i < size; i++) {
            _addPosToTransformationTable(i);
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add(shuffledArray[i]);
            square.id = `square-${i}`;
            // square.innerHTML = '' + i;

            boardElement.appendChild(square);
            board.push(square);

            square.addEventListener('click', e => {
                console.log(`Clicked on square ${e.target.id}`, e);
            })
        }
        _computeFlagNumbers();
    }

    function _computeFlagNumbers() {
        for (let i = 0; i < size; i++) {
            if (board[i].classList.contains('valid')) {
                const neighbors = getNeighbors(i);
                let bombCounter = neighbors.filter((square) => square.classList.contains('bomb')).length;
                board[i].setAttribute('data', bombCounter);
            }
        }
    }

    function _addPosToTransformationTable(pos) {
        const row = parseInt(pos / rows);
        const col = pos - (row * rows);
        const pos_name = `p_${row}_${col}`;
        transformationTable.board[pos] = pos_name;
        transformationTable[pos_name] = pos;
        return pos_name;
    }


    function getNeighborsIndexes(id) {
        const neighbors = [];
        let myPos2D = transformationTable.board[id];
        let my_row = parseInt(myPos2D.split('_')[1]);
        let my_col = parseInt(myPos2D.split('_')[2]);
        surroundings.forEach(neighbor => {
            let pos = `p_${(my_row+neighbor[0]) }_${(my_col+neighbor[1])}`;
            if (transformationTable[pos]) {
                neighbors.push(transformationTable[pos]);
            }
            // console.log(pos);
        });

        // console.log('my row and column: ', my_row, my_col);
        // console.log('neighbors: ', neighbors);
        return neighbors;

    }

    function getNeighbors(id) {
        const neighborIndexes = getNeighborsIndexes(id);
        return board.filter((square, index) => neighborIndexes.indexOf(index) >= 0);
    }


    return {
        createBoard,
        getNeighborsIndexes
    }

}


let testFunction = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom loaded');
    const gameEngine = initGameEngine();
    const boardElement = document.querySelector('#grid');
    gameEngine.createBoard(boardElement);
    testFunction = gameEngine.getNeighborsIndexes;

});