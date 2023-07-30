const game = (function(){
    const _bigGrid = [
        new Array(3),
        new Array(3),
        new Array(3)
    ];
    let _gamemode = null;
    let _nextMark = 'X';
    let _nextBigCoord = null;
    let _unavailableMinis = 0;
    let _aiMark = null;

    const gridLength = 3;
    function newGame(gamemode, aiMark){ //Used to initialize the first game and can clear the virtual game grid as well
        _nextMark = 'X'; 
        _nextBigCoord = null;
        _unavailableMinis = 0;
        _gamemode = gamemode;
        if (gamemode === 'ai') {
            _aiMark = aiMark; 
        } else {
            _aiMark = null;     
        }
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
            bigWinType: null,
            validMove: false,
            lastMark: _nextMark,
            nextGridCoord: null,
            isBigDraw: false,
            aiMove: null
        };
        const [R, C] = [bigCoord[0], bigCoord[1]]
        const [r, c] = [miniCoord[0], miniCoord[1]];

        if((_compareCoords(bigCoord, _nextBigCoord) || _nextBigCoord === null) && _bigGrid[R][C].takenBy === null && !_isMiniDraw([R, C]) && _bigGrid[R][C].grid[r][c] === undefined){ 
            result.validMove = true;
            _makeMark(bigCoord, miniCoord);
            const miniWinCoords = _getMiniWinCoords(bigCoord, miniCoord, _nextMark);
            if (miniWinCoords !== null){
                const currMiniGrid = _bigGrid[R][C];
                currMiniGrid.takenBy = _nextMark;
                result.miniWinCoords = miniWinCoords;

                if (currMiniGrid.takenCells < gridLength**2){ //If this mini grid was already full), 
                    //it would've already contributed to the unavailableMini's count in the makeMark function
                    _unavailableMinis++; 
                }

                const bigWinResult = _getBigWinCoords(bigCoord, _nextMark); 
                if (bigWinResult !== null){
                    result.bigWinCoords = bigWinResult.winningPositions;
                    result.bigWinType = bigWinResult.winType;
                }
            }
            _nextBigCoord = (_bigGrid[r][c].takenBy === null && !_isMiniDraw([r, c])) ? miniCoord : null; 
            result.nextGridCoord = _nextBigCoord;
            _changeNextMark();

            
            if (result.bigWinCoords === null){
                if (_nextMark === _aiMark){ //Shouldn't need to check gamemode also since aiMark should be null if its the pvp gamemode
                    const moveCoords = getAIMove(_nextBigCoord);
                    result.aiMove = moveCoords;
                }

                if (_unavailableMinis === gridLength**2){
                    result.isBigDraw = true;
                }
            }
            
        } else {
            console.log("Can't move there lol");
        }
        return result;
    }

    function getAIMove(nextBigCoord){
        if (nextBigCoord !== null){
            const [R, C] = nextBigCoord;
            const currMiniGrid = _bigGrid[R][C];
            const emptyCoords = _getAvailableMiniCoords(currMiniGrid);
            
            const randomIndex = Math.floor(Math.random() * emptyCoords.length)
            const fullCoord = [nextBigCoord, emptyCoords[randomIndex]]
            return fullCoord;
        } else {
            const emptyBigCoords = _getAvailableBigCoords();
            const randomIndex = Math.floor(Math.random() * emptyBigCoords.length)
            const randomBigCoord = emptyBigCoords[randomIndex];

            const emptyMiniCoords = _getAvailableMiniCoords(_bigGrid[randomBigCoord[0]][randomBigCoord[1]]); 
            const anotherRandomIndex = Math.floor(Math.random() * emptyMiniCoords.length)
            const randomMiniCoord = emptyMiniCoords[anotherRandomIndex];

            const fullCoord = [randomBigCoord, randomMiniCoord];
            return fullCoord;

        }
    }

    function _getAvailableBigCoords(){
        const availableBigCoords = [];
        for (let R = 0; R < gridLength; R++){
            for (let C = 0; C < gridLength; C++){
                const row = _bigGrid[R];
                if (row[C].takenBy === null && row[C].takenCells < 9){
                    availableBigCoords.push([R, C]);
                }
            }
        } 
        return availableBigCoords;
    }

    function _getAvailableMiniCoords(miniGrid){
        const emptyCoords = []; 
        for (let r = 0; r < gridLength; r++){
            for (let c = 0; c < gridLength; c++){
                const row = miniGrid.grid[r];
                if (row[c] === undefined){
                    emptyCoords.push([r, c]);
                }
            }
        }
        return emptyCoords;
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
        
        const currMiniGrid = _bigGrid[bigR][bigC];
        currMiniGrid.grid[miniR][miniC] = _nextMark;
        currMiniGrid.takenCells++; 

        if (currMiniGrid.takenCells === gridLength**2){
            _unavailableMinis++;
        }
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
                return {winningPositions, winType: 'row'};
            case col:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, bigC]); }
                return {winningPositions, winType: 'column'};
            case diag:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, i]); }
                return {winningPositions, winType: 'diagnal'};
            case rdiag:
                for (let i = 0; i < gridLength; i++) { winningPositions.push([i, gridLength-1-i]); }
                return {winningPositions, winType: 'reverse diagnal'};
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
            ],
            takenCells: 0
        }
    }

    function getCurrentGamemode(){
        return _gamemode;
    }

    function getAIMark(){
        return _aiMark;
    }

    return {
        newGame,
        stepTurn,
        getMiniGrid,
        getCurrentGamemode,
        getAIMark,
        getAIMove

    }

})();

//========================================================================================

const display = (function(game){
    const _body = document.querySelector('body');
    const _bigGrid = {
        grid: null,
        miniGrids: null
    }; 
    const _nextMarkDisplay = document.querySelector('.next-mark');
    const _utilitiesRow = document.querySelector('.utilities');

    function initializeUIFunctionality(){
        const pvpSelect = document.querySelector('#pvp-select');
        const aiSelect = document.querySelector('#ai-select');
        const startingMenu = document.querySelector('.starting-menu');
        const chooseGamemodeText = document.querySelector('.choose-gamemode-text');

        const chooseMarkText = document.querySelector('.choose-mark-text');
        const chooseX = document.querySelector('#choose-x');
        const chooseO = document.querySelector('#choose-o');

        pvpSelect.addEventListener('click', ()=>{
            startingMenu.style.display = 'none';
            game.newGame('pvp');
            _generateDomBoard();
        });

        aiSelect.addEventListener('click', () => {
            aiSelect.style.display = 'none';
            pvpSelect.style.display = 'none';
            chooseGamemodeText.style.display = 'none';

            chooseMarkText.style.display = 'block';
            chooseX.style.display = 'block';
            chooseO.style.display = 'block';
            
        });
            chooseX.addEventListener('click', () => {
                aiSelect.style.display = 'block';
                pvpSelect.style.display = 'block';
                chooseGamemodeText.style.display = 'block';

                chooseMarkText.style.display = 'none';
                chooseX.style.display = 'none';
                chooseO.style.display = 'none';               
                startingMenu.style.display = 'none';
                game.newGame('ai', 'O');
                _generateDomBoard();
            });
            chooseO.addEventListener('click', () => {
                aiSelect.style.display = 'block';
                pvpSelect.style.display = 'block';
                chooseGamemodeText.style.display = 'block';

                chooseMarkText.style.display = 'none';
                chooseX.style.display = 'none';
                chooseO.style.display = 'none';               
                startingMenu.style.display = 'none';
                game.newGame('ai', 'X');
                _generateDomBoard();
                //X always goes first so ai makes first move
                const [bigAiCoord, miniAiCoord] = game.getAIMove(null);
                _makeAiMove(bigAiCoord, miniAiCoord);
            });


        const optionsSelect = document.querySelector('#options');
        const optionsMenu = document.querySelector('.options-menu');
        const dimmedContainer = document.querySelector('.dimmed-container');
        const doneButtons = document.querySelectorAll('button.done');
        const newGameButtons = document.querySelectorAll('button.new-game')

        optionsSelect.addEventListener('click', () => {
            dimmedContainer.style.display = 'flex';
            optionsMenu.style.display = 'flex';
        });
        doneButtons.forEach((button) => {
                button.addEventListener('click', function(){
                this.parentNode.style.display = 'none';
                this.parentNode.parentNode.style.display = 'none';
            });
        });
        newGameButtons.forEach((button) => {
                button.addEventListener('click', function(){
                this.parentNode.style.display = 'none';
                this.parentNode.parentNode.style.display = 'none';

                const currGamemode = game.getCurrentGamemode();
                if (currGamemode === 'ai'){
                    game.newGame(currGamemode, 'O');
                } else {
                    game.newGame(currGamemode);
                }
                _generateDomBoard();
            });
        });
    }


    const gridLength = 3;
    function _generateDomBoard(){ 
        if (_bigGrid.grid !== null) {
            _body.removeChild(_bigGrid.grid);
        } 
        
        _utilitiesRow.style.display = 'flex';
        _nextMarkDisplay.textContent = 'X';
        

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
                    const currentCell = displayMiniGrid.cells[r][c];
                    currentCell.textContent = gridVal;
                    if (!currentCell.classList.contains(gridVal)) currentCell.classList.add(gridVal);
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
            displayMiniGrid.cells[r][c].classList.add(`taken-by-${winningMark}`);
        }
        displayMiniGrid.grid.classList.add(`taken`);
    }

    function _activateNextMiniGrid(coord){  
        _removeNextGrid();
        if (coord === null){
            _bigGrid.grid.classList.add('next-grid');
        } else {
            // const nextGameMiniGrid = game.getMiniGrid([R, C]);
            const [R, C] = coord;
            const nextDisplayMiniGrid = _bigGrid.miniGrids[R][C];
            nextDisplayMiniGrid.grid.classList.add('next-grid');
        }
        
    }

    function _displayBigWinMarks(bigWinCoords, winningMark){
        for (coord of bigWinCoords){
            const [R, C] = coord;
            _bigGrid.miniGrids[R][C].grid.classList.add(`taken-by-${winningMark}`);
        }
        _removeNextGrid();

        const cellButtons = document.querySelectorAll('.big-grid button');
        for (cellButton of cellButtons) {
            cellButton.disabled = true;
        }
    }

    function _removeNextGrid(){
        const currentNextGrid = document.querySelector('.next-grid');
        if (currentNextGrid !== null){
            currentNextGrid.classList.remove('next-grid');
        }
    }

    function _displayWinScreen(winningMarkText, winTypeText){
        const dimmedContainer = document.querySelector('.dimmed-container');
        const optionsMenu = document.querySelector('.options-menu');
        const winScreen = document.querySelector('.win-screen');
        const winMarkDisplay = document.querySelector('.winner-mark');
        const winTypeDisplay = document.querySelector('.win-type')

        winTypeDisplay.textContent = winTypeText;
        dimmedContainer.style.display = 'flex';
        optionsMenu.style.display = 'none';
        winScreen.style.display = 'flex';
        winMarkDisplay.textContent = winningMarkText;
    }

    function _displayBigDraw(){
        _removeNextGrid();
        const cellButtons = document.querySelectorAll('.big-grid button');
        for (cellButton of cellButtons) {
            cellButton.disabled = true;
        }
        _nextMarkDisplay.textContent = '-';
        _displayWinScreen('its a draw.', "both of you lost lol");
    }

    function _onCellClick(){
        const miniG = this.parentNode;
        const bigCoord = [+miniG.dataset.bigrow, +miniG.dataset.bigcol];
        const miniCoord = [+this.dataset.minirow, +this.dataset.minicol];

        const stepAttempt = game.stepTurn(bigCoord, miniCoord);
        +_processStep(stepAttempt, bigCoord);
    }

    function _processStep(stepAttempt, bigCoord){
        if (stepAttempt.validMove){
            _updateMiniGridMarks(bigCoord);
            const miniWinCoords = stepAttempt.miniWinCoords;
            if (miniWinCoords !== null){
                _displayMiniWinMarks(bigCoord, miniWinCoords, stepAttempt.lastMark);
                const bigWinCoords = stepAttempt.bigWinCoords;
                if (bigWinCoords !== null){
                    const winningMark = stepAttempt.lastMark;
                    const winningMarkText = `${winningMark} wins!`;
                    const winTypeText = `by a ${stepAttempt.bigWinType}`;
                    _nextMarkDisplay.textContent = '-';
                    _displayBigWinMarks(bigWinCoords, winningMark);
                    _displayWinScreen(winningMarkText, winTypeText);
                    return;
                }
            }
            if (stepAttempt.isBigDraw){
                _displayBigDraw();
                return
            }
            const nextMark = (stepAttempt.lastMark === 'X') ? 'O' : 'X';
            _nextMarkDisplay.textContent = nextMark;
            if (nextMark === game.getAIMark()){
                //AI step code
                const bigAiCoord = stepAttempt.aiMove[0];
                const miniAiCoord = stepAttempt.aiMove[1];

                _makeAiMove(bigAiCoord, miniAiCoord);
            } else {
                _activateNextMiniGrid(stepAttempt.nextGridCoord);
            }
        } 
    }

    function _makeAiMove(bigAiCoord, miniAiCoord){
        const aiStep = game.stepTurn(bigAiCoord, miniAiCoord);
        _removeNextGrid(); 
        _showAiMakingMove(bigAiCoord, miniAiCoord);
        setTimeout(function(){
            _processStep(aiStep, bigAiCoord);
        }, 600);

    }

    function _showAiMakingMove(bigAiCoord, miniAiCoord){
        const [R, C] = bigAiCoord;
        const [r, c] = miniAiCoord;

        const miniGrid = _bigGrid.miniGrids[R][C];
        const cell = miniGrid.cells[r][c];

        miniGrid.grid.classList.add('next-ai-grid');
        cell.classList.add('ai-highlight');
        setTimeout(function(){
            cell.classList.add('ai-press');
            setTimeout(function(){
                miniGrid.grid.classList.remove('next-ai-grid');
                cell.classList.remove('ai-highlight');
                cell.classList.remove('ai-press');
            }, 200);
        }, 400);
    }

    return {
        initializeUIFunctionality
    };
})(game);



display.initializeUIFunctionality();
