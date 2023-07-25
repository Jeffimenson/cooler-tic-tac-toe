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
        for (let r = 0; r < gridLength; r++){
            for (let c = 0; c < gridLength; c++){
                _bigGrid[r][c] = _MiniGrid(); 
            }
        }
    }

    function stepTurn(bigCoord, miniCoord){
        const result = {
            miniWinCoords: null,
            bigWinCoords: null,
            validMove: false,
            currMark: _nextMark
        }
        if((bigCoord === _nextBigCoord || _nextBigCoord === null)){
            result.validMove = true;
            _makeMark(bigCoord, miniCoord);
            _nextBigCoord = (_bigGrid[bigR][bigC].takenBy !== null) ? miniCoord : null; 
            const miniWinCoords = _getMiniWinCoords(bigCoord, miniCoord, _nextMark); 
            if (miniWinCoords !== null){
                const [R, C] = [bigCoord[0], bigCoord[1]]
                _bigGrid[R][C].takenBy = _nextMark;
                result.miniWinCoords = miniWinCoords;
                const bigWinCoords = _getBigWinCoords(bigCoord); 
                if (bigWinCoords !== null){
                    result.bigWinCoords = bigWinCoords;
                }
            }
            _changeNextMark();
        }
        return result;
    }

    function _makeMark(bigCoord, miniCoord){
        const [bigR, bigC] = bigCoord;
        const [miniR, miniC] = miniCoord;
        
        _bigGrid[bigR][bigC].grid[miniR][miniC] = _nextMark;
    }

    function isNextBigCoord(bigCoord){
        return bigCoord === _nextBigCoord;
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
        makeMark,
        isNextBigCoord
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
        miniGrid.setAttribute('data-bigRow', R);
        miniGrid.setAttribute('data-bigCol', C);
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
                cell.setAttribute('data-miniRow', r);
                cell.setAttribute('data-miniCol', c);
                miniGrid.appendChild(cell);
                miniCells[r][c] = cell;
            }
        }
        return {
            grid: miniGrid,
            cells: miniCells 
        }
    }

    function _onCellClick(){
        const miniG = this.parentNode;
        const bigCoord = [miniG.dataset.bigRow, miniG.dataset.bigC];
        const miniCoord = [this.dataset.miniRow, this.dataset.miniCol];

        const stepAttempt = game.stepTurn(bigCoord, miniCoord);
        if (stepAttempt.validMove){

        } 

        
    }

    return {
        generateDomElements
    };
})(game);


game.newGame();
display.generateDomElements();
