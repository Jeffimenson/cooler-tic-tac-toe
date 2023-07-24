const display = (function(){
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
                _bigGrid.miniGrids[i][j] = _MiniGrid();
                _bigGrid.grid.appendChild(_bigGrid.miniGrids[i][j].grid);
            }
        }
    } 

    function _MiniGrid(){
        const miniGrid = document.createElement('div');
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
        // WORK IN PROGRESS
    }

    return {
        generateDomElements
    };
})();

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

    function makeMark(bigCoord, miniCoord){
        const [bigR, bigC] = bigCoord;
        const [miniR, miniC] = miniCoord;
        
        _bigGrid[bigR][bigC].grid[miniR][miniC] = _nextMark;
        _nextBigCoord = (_bigGrid[bigR][bigC].takenBy !== null) ? miniCoord : null; 
        _changeNextMark();
        console.log(_bigGrid[bigR][bigC].grid);
    }

    function isNextBigCoord(bigCoord){
        return bigCoord === _nextBigCoord;
    }

    function checkMiniWin(bigCoord, miniCoord, mark){
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
        if (col === gridLength || row === gridLength  || diag === gridLength  || rdiag === gridLength ){
            return true; //Possibly do more than just return true or false
        } else {
            return false;
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

game.newGame();

display.generateDomElements();
