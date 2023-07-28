const game = (function(){
    const _bigGrid = [
        new Array(3),
        new Array(3),
        new Array(3)
    ];
    let _nextMark = 'X';
    let _nextBigCoord = null;

    const gridLength = 3;
    function newGame(){ //Used to initialize the first game and can clear the virtual game grid as well
        _nextMark = 'X'; 
        _nextBigCoord = null;
        for (let r = 0; r < gridLength; r++){
            for (let c = 0; c < gridLength; c++){
                _bigGrid[r][c] = _MiniGrid(); 
            }
        }
    }

    function getMiniGrid(bigCoord){
        return _bigGrid[bigCoord[0]][bigCoord[1]];
    }

    function stepTurn(bigCoord, miniCoord){
        const result = {
            miniWinCoords: null,
            bigWinCoords: null,
            validMove: false,
            lastMark: _nextMark,
            nextGridCoord: null
        }
        const [R, C] = [bigCoord[0], bigCoord[1]]
        const [r, c] = [miniCoord[0], miniCoord[1]];

        if((_compareCoords(bigCoord, _nextBigCoord) || _nextBigCoord === null) && _bigGrid[R][C].takenBy === null && !_isMiniDraw([R, C]) && _bigGrid[R][C].grid[r][c] === undefined){ 
            result.validMove = true;
            _makeMark(bigCoord, miniCoord);
            const miniWinCoords = _getMiniWinCoords(bigCoord, miniCoord, _nextMark);
            if (miniWinCoords !== null){
                _bigGrid[R][C].takenBy = _nextMark;
                result.miniWinCoords = miniWinCoords;
                const bigWinCoords = _getBigWinCoords(bigCoord, _nextMark); 
                if (bigWinCoords !== null){
                    result.bigWinCoords = bigWinCoords;
                }
            }
            _nextBigCoord = (_bigGrid[r][c].takenBy === null && !_isMiniDraw([r, c])) ? miniCoord : null; 
            result.nextGridCoord = _nextBigCoord;
            _changeNextMark();
        } else {
            console.log("Can't move there lol");
        }
        return result;
    }

    function _isMiniDraw([R, C]){
        const miniGrid = _bigGrid[R][C];
        let filledCells = 0;
        for (let r = 0; r < gridLength; r++){
            miniGrid.grid[r].forEach(cell => {
                if (cell !== undefined) filledCells++; 
            });
        }
        return filledCells === 9 && miniGrid.takenBy === null;
    }

    function _makeMark(bigCoord, miniCoord){
        const [bigR, bigC] = bigCoord;
        const [miniR, miniC] = miniCoord;
        
        _bigGrid[bigR][bigC].grid[miniR][miniC] = _nextMark;
    }

    function _compareCoords(coord1, coord2){ //Only for arrays with two slots
        if (coord1 === null || coord2 === null) return false;
        return coord1[0] === coord2[0] && coord1[1] == coord2[1];
    }


    function _getMiniWinCoords(bigCoord, miniCoord, mark){
        let [col, row, diag, rdiag] = [0, 0, 0, 0]; 
        const [bigR, bigC] = bigCoord;
        const [miniR, miniC] = miniCoord;
        const miniGrid = _bigGrid[bigR][bigC];
        for (let i = 0; i < gridLength; i++){
            if (miniGrid.grid[miniR][i] === mark) row++;
            if (miniGrid.grid[i][miniC] === mark) col++;
            if (miniGrid.grid[i][i] === mark) diag++;
            if (miniGrid.grid[i][gridLength-1-i] === mark) rdiag++;
        }
        const winningPositions = [];
        switch(gridLength){
            case row:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([miniR, i]); }
                return winningPositions;
            case col:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, miniC]); }
                return winningPositions;
            case diag:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, i]); }
                return winningPositions;
            case rdiag:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, gridLength-1-i]); }
                return winningPositions;
            default:
                return null; 
        }
    }

    function _getBigWinCoords(bigCoord, mark){
        let [col, row, diag, rdiag] = [0, 0, 0, 0]; 
        const [bigR, bigC] = bigCoord;
        for (let i = 0; i < gridLength; i++){
            if (_bigGrid[bigR][i].takenBy === mark) row++;
            if (_bigGrid[i][bigC].takenBy === mark) col++;
            if (_bigGrid[i][i].takenBy === mark) diag++;
            if (_bigGrid[i][gridLength-1-i].takenBy === mark) rdiag++;
        }
        const winningPositions = [];
        switch(gridLength){
            case row:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([bigR, i]); }
                return winningPositions;
            case col:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, bigC]); }
                return winningPositions;
            case diag:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, i]); }
                return winningPositions;
            case rdiag:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, gridLength-1-i]); }
                return winningPositions;
            default:
                return null; 
        }
    }

    function _changeNextMark(){
        _nextMark = (_nextMark === 'X') ? 'O' : 'X';
    }

    function _MiniGrid(){
        return {
            takenBy: null,
            grid: [
                new Array(3),
                new Array(3),
                new Array(3)
            ]
        }
    }

    return {
        newGame,
        stepTurn,
        getMiniGrid
    }

})();

const display = (function(game){
    const _body = document.querySelector('body');
    const _bigGrid = {
        grid: null,
        miniGrids: null
    }; 

    const gridLength = 3;
    function generateDomElements(){ //I might refactor this function in the future so it can be used to clear the grids and make new ones for a new game
         _bigGrid.grid = document.createElement('div');
         _bigGrid.miniGrids = [
            new Array(3),
            new Array(3),
            new Array(3)
        ];       
        _bigGrid.grid.classList.add('big-grid');
        _bigGrid.grid.classList.add('next-grid');
        _body.appendChild(_bigGrid.grid);

        for (let i = 0; i < gridLength; i++){
            for (let j = 0; j < gridLength; j++){
                _bigGrid.miniGrids[i][j] = _MiniGrid(i, j);
                _bigGrid.grid.appendChild(_bigGrid.miniGrids[i][j].grid);
            }
        }
        
        
    } 

    function _MiniGrid(R, C){
        const miniGrid = document.createElement('div');
        miniGrid.setAttribute('data-bigrow', R);
        miniGrid.setAttribute('data-bigcol', C);
        miniGrid.classList.add('mini-grid');

        const miniCells = [
            new Array(3),
            new Array(3),
            new Array(3)
        ];

        for (let r = 0; r < gridLength; r++){
            for (let c = 0; c < gridLength; c++){
                const cell = document.createElement('button');
                cell.setAttribute('type', 'button');
                cell.classList.add('mini-cell');
                cell.addEventListener('click', _onCellClick);
                cell.setAttribute('data-minirow', r);
                cell.setAttribute('data-minicol', c);
                miniGrid.appendChild(cell);
                miniCells[r][c] = cell;
            }
        }
        return {
            grid: miniGrid,
            cells: miniCells 
        }
    }

    function _updateMiniGridMarks([R, C]){
        const gameMiniGrid = game.getMiniGrid([R, C]);
        const displayMiniGrid = _bigGrid.miniGrids[R][C];

        let filledCells = 0;
        for (let r = 0; r < gridLength; r++){
            for (let c = 0; c < gridLength; c++){
                const gridVal = gameMiniGrid.grid[r][c];
                if (gridVal !== undefined){
                    displayMiniGrid.cells[r][c].textContent = gridVal;
                    filledCells++; 
                }
                
            }
        }
        if (filledCells === 9 && gameMiniGrid.takenBy === null){
            displayMiniGrid.grid.classList.add('taken'); //give a unique class later on 
        }

    }

    function _displayMiniWinMarks([R, C], miniWinCoords, winningMark){
        const displayMiniGrid = _bigGrid.miniGrids[R][C];
        for (coord of miniWinCoords){
            const [r, c] = coord; 
            displayMiniGrid.cells[r][c].classList.add(winningMark);
        }
        displayMiniGrid.grid.classList.add('taken');
    }

    function _activateNextMiniGrid(coord){  
        // document.querySelector('.next-grid').classList.remove('next-grid');
        // if (nextGameMiniGrid.takenBy === null){
        //     nextDisplayMiniGrid.grid.classList.add('next-grid');
        // } else {
        //     _bigGrid.grid.classList.add('next-grid');
        // }

        document.querySelector('.next-grid').classList.remove('next-grid');
        if (coord === null){
            _bigGrid.grid.classList.add('next-grid');
        } else {
            // const nextGameMiniGrid = game.getMiniGrid([R, C]);
            const [R, C] = coord;
            const nextDisplayMiniGrid = _bigGrid.miniGrids[R][C];
            nextDisplayMiniGrid.grid.classList.add('next-grid');
        }
        
    }

    function _displayBigWin(bigWinCoords, winningMark){
        for (coord of bigWinCoords){
            const [R, C] = coord;
            _bigGrid.miniGrids[R][C].grid.classList.add(winningMark);
        }
        document.querySelector('.next-grid').classList.remove('next-grid');

        const cellButtons = document.querySelectorAll('.big-grid button');
        for (cellButton of cellButtons) {
            cellButton.disabled = true;
        }
    }

    function _onCellClick(){
        const miniG = this.parentNode;
        const bigCoord = [+miniG.dataset.bigrow, +miniG.dataset.bigcol];
        const miniCoord = [+this.dataset.minirow, +this.dataset.minicol];

        const stepAttempt = game.stepTurn(bigCoord, miniCoord);
        if (stepAttempt.validMove){
            _updateMiniGridMarks(bigCoord);
            const miniWinCoords = stepAttempt.miniWinCoords;
            if (miniWinCoords !== null){
                _displayMiniWinMarks(bigCoord, miniWinCoords, stepAttempt.lastMark);
                const bigWinCoords = stepAttempt.bigWinCoords;
                if (bigWinCoords !== null){
                    const winningMark = stepAttempt.lastMark;
                    _displayBigWin(bigWinCoords, stepAttempt.lastMark);
                    return;
                }
            }
            _activateNextMiniGrid(stepAttempt.nextGridCoord);
        } 
    }

    return {
        generateDomElements
    };
})(game);


game.newGame();
display.generateDomElements();
