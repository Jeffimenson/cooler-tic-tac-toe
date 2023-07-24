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
    let nextMark = 'X';

    const gridLength = 3;
    function newGame(){
        for (let r = 0; r < gridLength; r++){
            for (let c = 0; c < gridLength; c++){
                _bigGrid[r][c] = _MiniGrid(); 
            }
        }
    }

    function makeMark(bigCoord, miniCoord){
        const [bigR, bigC] = bigCoord;
        const [miniR, miniC] = miniCoord;
        
        _bigGrid[bigR][bigC].grid[miniR][miniC] = nextMark;
        _changeNextMark();
        console.log(_bigGrid);
    }

    function _changeNextMark(){
        nextMark = (nextMark === 'X') ? 'O' : 'X';
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
        makeMark
    }

})();

game.newGame();

display.generateDomElements();
