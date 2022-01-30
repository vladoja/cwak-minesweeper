function restartGame() {
    window.location.reload();
}


const initTimer = (element) => {
    let counter = 0;
    let timerId = null;
    let startTime;

    function convertToTimeString(timeInSeconds) {
        let seconds = timeInSeconds % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        let minutes = parseInt(timeInSeconds / 60);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return `${minutes}:${seconds}`;
    }

    function startTimer() {
        startTime = Date.now();
        timerId = setInterval(() => {
            counter++;
            if (element) {
                element.innerHTML = convertToTimeString(counter);
            }
        }, 1000);

    }


    function stopTimer() {
        let stopTime = Date.now();
        let diff = (startTime + (counter * 1000) - stopTime);
        // console.log('Stop time diff: ', diff);
        clearInterval(timerId);
    }

    return {
        startTimer,
        stopTimer
    }
}

const initGameEngine = () => {
    let isGameRunning = false;
    let isGameOver = false;
    const flagIcon = '🚩';
    const bombIcon = '💣';
    const gameNotStartedIcon = '🙂';
    const gameWonIcon = '😎';
    const gameInProgressIcon = '🤔';
    const gameLostIcon = '😵';
    const rows = 10;
    const columns = 10;
    const size = rows * columns;
    const bombsAmount = 14;
    let bombsLeft = bombsAmount;
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

    let bombsLeftElement = null;
    let gameStatusElement = null;
    let timerElement = null;

    let timer = null;

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
        // console.log('Creating board: ', boardElement);
        for (let i = 0; i < size; i++) {
            _addPosToTransformationTable(i);
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add(shuffledArray[i]);
            // square.id = `square-${i}`;
            square.id = `${i}`;
            // square.innerHTML = '' + i;

            boardElement.appendChild(square);
            board.push(square);

            square.addEventListener('click', e => {
                click(e.target);
                // console.log(`Clicked on square ${e.target.id}`, e);
            })
            square.addEventListener('contextmenu', e => {
                e.preventDefault();
                rightClick(e.target);

                // click(e.target);
                // console.log(`Clicked on square ${e.target.id}`, e);
            })
        }
        _computeFlagNumbers();
    }

    function rightClick(element) {
        if (isGameOver) return;
        if (element.classList.contains('checked')) {
            return;
        }
        if (element.classList.contains('flag')) {
            element.classList.remove('flag');
            element.innerHTML = '';
            bombsLeft++;
            // element.classList.add('checked')
        } else {
            if (bombsLeft === 0) {
                return;
            }
            element.classList.add('flag');
            element.innerHTML = flagIcon;
            bombsLeft--;
        }
        bombsLeftElement.innerHTML = bombsLeft;
        if (bombsLeft === 0) {
            if (_checkAll()) {
                _handleGameOver();
            }
        }
    }


    function click(element) {
        // console.log(`Clicked on square ${element.id}`);
        if (isGameOver) return;

        if (!isGameRunning) {
            isGameRunning = true;
            _startTimer();
        }

        if (element.classList.contains('checked') || element.classList.contains('flag')) {
            console.log('Already checked');
            return;
        }
        if (element.classList.contains('bomb')) {
            console.log('GAME OVER');
            element.innerHTML = bombIcon;
            isGameOver = true;
            const failedOnPosition = parseInt(element.id);
            _handleGameOver(failedOnPosition);
            return;
        }

        // if (element.classList.contains('flag')) {
        //     element.classList.remove('flag');
        //     element.classList.add('questionmark');
        //     return;
        // }
        let total = element.getAttribute('data');
        if (total > 0) {
            element.innerHTML = total;
            element.classList.add(_setNumberColorClass(total));
        } else {
            _checkSquare(element);
        }
        element.classList.add('checked');
        if (bombsLeft === 0) {
            if (_checkAll()) {
                _handleGameOver();
            }
        } else {
            gameStatusElement.innerHTML = gameInProgressIcon;
        }


    }



    function _checkAll() {
        let checkedPositionCounter = 0;
        let flagedBombCounter = 0;
        board.forEach((square) => {
            if (square.classList.contains('valid') && square.classList.contains('checked')) {
                checkedPositionCounter++;
            } else if (square.classList.contains('bomb') && square.classList.contains('flag')) {
                flagedBombCounter++;
            } else return;
        });
        console.log('Flaged bombs counter: ', flagedBombCounter);
        console.log('Checked positions counter: ', checkedPositionCounter);
        if (flagedBombCounter === bombsAmount && checkedPositionCounter === (size - bombsAmount)) {
            console.log('VICTORY ');
            return true;
        } else {
            return false;
        }
    }


    function _revealAll(failedOnPosition = null) {
        console.log('Revealing all')
        board.forEach((square, index) => {
            if (square.classList.contains('valid')) {
                if (!square.classList.contains('checked')) {
                    let total = square.getAttribute('data');
                    if (total > 0) {
                        square.innerHTML = total;
                        square.classList.add(_setNumberColorClass(total));
                    }

                }
                if (square.classList.contains('flag')) {
                    square.classList.add('failed');
                }
            } else if (square.classList.contains('bomb')) {
                if (square.classList.contains('flag')) {
                    square.innerHTML = flagIcon;
                } else {
                    square.innerHTML = bombIcon;
                    if (index === failedOnPosition) {
                        square.classList.add('failed');
                    }
                }
            }
            square.classList.add('revealed');

        });
    }


    function _handleGameOver(failedOnPosition = null) {
        console.log('Game over');
        timer.stopTimer();
        if (failedOnPosition) {
            gameStatusElement.innerHTML = gameLostIcon;
        } else {
            gameStatusElement.innerHTML = gameWonIcon;
        }
        if (isGameOver) {
            _revealAll(failedOnPosition);
        }
        isGameOver = true;
        // _revealAll();

    }

    function _checkSquare(square) {
        let squareId = parseInt(square.id);
        // console.log('checkSquare: ', squareId);
        setTimeout(() => {
            let neighbors = getNeighbors(squareId);
            for (let neighbor of neighbors) {
                click(neighbor);
            }
        }, 10);

    }

    function _computeFlagNumbers() {
        for (let i = 0; i < size; i++) {
            if (board[i].classList.contains('valid')) {
                const neighbors = getNeighbors(i);
                let bombCounter = neighbors.filter((square) => square.classList.contains('bomb')).length;
                board[i].setAttribute('data', bombCounter);
                // if (bombCounter > 0) {
                //     board[i].innerHTML = '' + bombCounter;
                // }

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


    function _setNumberColorClass(total = 1) {
        return `c-${total}`;
    }

    function getNeighborsIndexes(id) {
        const neighbors = [];
        let myPos2D = transformationTable.board[id];
        let my_row = parseInt(myPos2D.split('_')[1]);
        let my_col = parseInt(myPos2D.split('_')[2]);
        surroundings.forEach(neighbor => {
            let pos = `p_${(my_row+neighbor[0]) }_${(my_col+neighbor[1])}`;
            if (transformationTable[pos] !== undefined) {
                neighbors.push(transformationTable[pos]);
            }
            // console.log(pos);
        });

        // console.log('my row and column: ', my_row, my_col);
        // console.log('neighbors: ', neighbors);
        return neighbors;

    }


    function _startTimer() {
        if (timer) {
            timer.startTimer();
        }
    }

    function getNeighbors(id) {
        const neighborIndexes = getNeighborsIndexes(id);
        return board.filter((square, index) => neighborIndexes.indexOf(index) >= 0);
    }

    function setBombsLeftElement(element) {
        if (!element) {
            alert('BombsLeftElement cannot be null');
            return;
        }
        bombsLeftElement = element;
        bombsLeftElement.innerHTML = bombsLeft;
    }


    function setGameStatusElement(element) {
        if (!element) {
            alert('gameStatusElement cannot be null');
        }
        gameStatusElement = element;
        gameStatusElement.innerHTML = gameNotStartedIcon;
    }


    function setTimerElement(element) {
        if (!element) {
            alert('timerElement cannot be null ');
        }
        timerElement = element;
        timer = initTimer(timerElement);
    }

    function getBombs() {
        return bombsLeft;
    }

    return {
        createBoard,
        getNeighborsIndexes,
        getBombs,
        setBombsLeftElement,
        setGameStatusElement,
        setTimerElement
    }

}


let testFunction = null;

document.addEventListener('DOMContentLoaded', () => {
    const gameEngine = initGameEngine();
    const boardElement = document.querySelector('#grid');
    gameEngine.createBoard(boardElement);
    gameEngine.setBombsLeftElement(document.querySelector('#bomb-counter span'));
    gameEngine.setGameStatusElement(document.querySelector('#game-status'));
    gameEngine.setTimerElement(document.querySelector('#game-timer'));

});