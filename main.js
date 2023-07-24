const display = (function(){
    const body = document.querySelector('body');
    const bigGrid = {
        grid: document.createElement('div'),
        miniGrids: [
            new Array(3),
            new Array(3),
            new Array(3)
        ]
    }; 

    function generateDomElements(){
        bigGrid.grid.classList.add('big-grid');
        body.appendChild(bigGrid.grid);

        const gridLength = 3;
        for (let i = 0; i < gridLength; i++){
            for (let j = 0; j < gridLength; j++){
                const miniGrid = document.createElement('div');
                miniGrid.classList.add('mini-grid');
                bigGrid.grid.appendChild(miniGrid);

                const miniCells = [
                    new Array(3),
                    new Array(3),
                    new Array(3)
                ];

                for (let i = 0; i < gridLength; i++){
                    for (let j = 0; j < gridLength; j++){
                        const cell = document.createElement('button');
                        cell.setAttribute('type', 'button');
                        cell.classList.add('mini-cell');
                        cell.addEventListener('click', _onCellClick);
                        
                        miniGrid.appendChild(cell);
                        miniCells[i][j] = cell;
                    }
                }
                bigGrid.miniGrids[i][j] = {
                    grid: miniGrid,
                    cells: miniCells 
                };
            }
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
    
})();

display.generateDomElements();
