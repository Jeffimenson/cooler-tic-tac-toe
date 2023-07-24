const display = (function(){
    const body = document.querySelector('body');
    const bigGrid = document.createElement('div');
    bigGrid.classList.add('big-grid');
    body.appendChild(bigGrid);

    const miniGrids = [
        new Array(3),
        new Array(3),
        new Array(3)
    ];
    const gridLength = 3;
    for (let i = 0; i < gridLength; i++){
        for (let j = 0; j < gridLength; j++){
            const miniGrid = document.createElement('div');
            miniGrid.classList.add('mini-grid');
            bigGrid.appendChild(miniGrid);

            const miniCells = [
                new Array(3),
                new Array(3),
                new Array(3)
            ];

            for (let i = 0; i < gridLength; i++){
                for (let j = 0; j < gridLength; j++){
                    const cell = document.createElement('div');
                    cell.classList.add('mini-cell');
                    
                    miniGrid.appendChild(cell);

                    miniCells[i][j] = cell;
                }
            }
            miniGrids[i][j] = {
                grid: miniGrid,
                cells: miniCells 
            };
            
        }
    }
    
})();

const game = (function(){
    
})();
