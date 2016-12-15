import React from 'react';

export default class Application extends React.Component {
    constructor() {
        super();
        /**size options */
        this.size = {
            small: { name: 'small', cellSide: 10, gridColums: 50, gridRows: 30 },
            medium: { name: 'medium', cellSide: 10, gridColums: 70, gridRows: 50 },
            large: { name: 'large', cellSide: 8, gridColums: 100, gridRows: 80 }
        }
        /**initial size */
        this.state = { size: this.size.medium, isInitial: true };

    }

    createMarkup(elements) {
        return { __html: elements };
    }

    createGrid(rows, columns) {
        /**create a grid with number of arrays equal to number of rows. 
         * Each array consists of number of elements equal to columns and each element will have 0 or one randomly.
         */
        this.grid = [];
        for (let i = 0; i < rows; i++) {
            this.grid.push([]);
            for (let k = 0; k < columns; k++) {
                this.grid[i].push({ age: '', value: 0 });
                if ((i == rows - 1) && (k == columns - 1)) {
                    return true;
                }
            }
        }
    }


    insertRandomLifeToGridCells() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let k = 0; k < this.grid[i].length; k++) {
                /**get a random number */
                let randomNum = Math.random();
                /**Decide whether a cell is live or dead based on this random number */
                if (randomNum > 0.95) {
                    this.grid[i][k].value = 1;
                    this.grid[i][k].age = 'young'
                }
                /**if the iteration cam to end return true */
                if (i == this.grid.length - 1 && k == this.grid[i].length - 1) {
                    return true;
                }
            }
        }
    }

    createHtmlElementsForGrid() {
        this.gridHtml = []; /**declare this.griHtmlElements array to push cells*/
        for (let i = 0; i < this.grid.length; i++) {
            for (let k = 0; k < this.grid[i].length; k++) {
                /**style for cell elements*/
                let younger = '#F78787', older = '#D50B0B';
                let cellBorder = '.5px solid #088A04';
                let cellStyle = {
                    height: `${this.state.size.cellSide}px`,
                    width: `${this.state.size.cellSide}px`,
                    borderRight: cellBorder,
                    borderBottom: cellBorder
                };
                if (i == 0) { /**if it is first row then add border-top */
                    cellStyle.borderTop = cellBorder;
                }
                if (k == 0) { /**if it is first column then add border-left */
                    cellStyle.borderLeft = cellBorder;
                }
                if (this.grid[i][k].value == 1) {
                    cellStyle.backgroundColor = younger;
                }
                /**push the cell div into this.gridHtml array*/
                this.gridHtml.push(<div id={'cell-' + i + '-' + k} key={i + '-' + k} className='cell' style={cellStyle}></div>);
                if (i == this.grid.length - 1 && k == this.grid[i].length - 1) {
                    return true;
                }
            }
        }
    }

    formCells() {
        /**first create the grid then check if grid is create.
         * If the grid is created then return the cell elements.
         */
        let gridCreated = this.createGrid(this.state.size.gridRows, this.state.size.gridColums);
        if (gridCreated) {
            if (this.state.isInitial) { /**if it is initial state insert life into grid cells randomly. */
                let insertedLife = this.insertRandomLifeToGridCells();
                if (insertedLife) {
                    let gridMapped = this.createHtmlElementsForGrid();
                    if (gridMapped) {
                        this.play();
                        return this.gridHtml;
                    }
                }
            } else {
                let gridMapped = this.createHtmlElementsForGrid();
                if (gridMapped) {
                    return this.gridHtml;
                }
            }
        }
    }

    formGameOptions() {
        let gameOptions = ['Play', 'Pause', 'Clear'], gameOptionsHtmlElements = [];
        for (let i = 0; i < gameOptions.length; i++) {
            let option = gameOptions[i];
            gameOptionsHtmlElements.push(
                <span key={option}>
                    <button className='btn game-btn'>{option}</button>&nbsp;
                </span>
            );
            if (i == gameOptions.length - 1) {
                return gameOptionsHtmlElements;
            }
        }
    }

    formSizeOptions() {
        let sizeOptions = ['small', 'medium', 'large'], sizeOptionsHtmlElements = [];
        for (let i = 0; i < sizeOptions.length; i++) {
            let size = sizeOptions[i];
            sizeOptionsHtmlElements.push(
                <span key={size}>
                    <button data-gridSize={size} style={{ backgroundColor: this.state.size.name == size ? '#E6A360' : '#29BC8D', border: this.state.size.name == size ? '1px solid #E6A360' : '1px solid #29BC8D' }} onClick={this.changeSize.bind(this)} className='btn option-btn size-btn'>
                        {size.substring(0, 1).toUpperCase() + size.substring(1, size.length)}
                    </button>
                    &nbsp;
                </span>
            );
            if (i == sizeOptions.length - 1) {
                return sizeOptionsHtmlElements;
            }
        }
    }

    formSpeedOptions() {
        let speedOptions = ['slow', 'medium', 'Fast'], speedOptionsHtmlElements = [];
        for (let i = 0; i < speedOptions.length; i++) {
            let speed = speedOptions[i];
            speedOptionsHtmlElements.push(
                <span key={speed}>
                    <button className='btn option-btn speed-btn'>
                        {speed.substring(0, 1).toUpperCase() + speed.substring(1, speed.length)}
                    </button>&nbsp;
                </span>
            );
            if (i == speedOptions.length - 1) {
                return speedOptionsHtmlElements;
            }
        }
    }


    changeSize(e) {
        let sizeName = e.target.attributes.getNamedItem('data-gridSize').value;
        if (this.state.size.name !== sizeName) {
            this.setState({ size: this.size[sizeName], isInitial: false });
        }
    }


    play() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let k = 0; k < this.grid[i].length; k++) {
                let cell = this.grid[i][k];
                /**check if the row number is greater than 0 and less than max rows number 
                 * and column number is greater than zero and less than max column number
                 */
                let topRow = (i - 1) < 0 ? this.grid.length - 1 : i - 1,
                    sameRow = i,
                    bottomRow = (i + 1) < this.grid.length - 1 ? i + 1 : 0,
                    leftColumn = (k - 1) < 0 ? this.grid[i].length - 1 : k - 1,
                    sameColumn = k,
                    rightColumn = (k + 1) < this.grid[i].length - 1 ? k + 1 : 0;
                /**get neighbours of the current cell */
                let neighbours = [
                    [topRow, leftColumn], [topRow, sameColumn], [topRow, rightColumn],
                    [sameRow, leftColumn], [sameRow, rightColumn],
                    [bottomRow, leftColumn], [bottomRow, sameColumn], [bottomRow, rightColumn]
                ];
               
                let neighbourStrength = 0;
                neighbours.forEach(n => {
                    if (this.grid[n[0]][n[1]].value == 1) {
                        neighbourStrength += 1;
                    }
                });
                
                if(cell.age){ /**if current cell is live cell */
                    if (neighbourStrength > 1 && neighbourStrength < 4) { /**if cell has sufficient neighbours will live */
                        if(cell.age == 'young'){
                            cell.age == 'adult'
                        }
                    } else { /** else cell will die */
                        this.grid[i][k] = {age: '', value: 0}
                    }
                } else { /**if current cell is dead cell */
                    if(neighbourStrength === 3){ /**if it has enough support make it alive */
                        this.grid[i][k] = {age: 'young', value: 1}
                    }
                }
                
            }
        }
    }

    render() {
        return (
            <div className='container'>
                <h1 id='heading' className='text-center'>Game of life</h1>
                <div style={{ height: (this.state.size.cellSide * this.state.size.gridRows) + this.state.size.gridRows + 1 + 'px', width: (this.state.size.cellSide * this.state.size.gridColums) + this.state.size.gridColums + 1 + 'px' }} id='game-grid'>
                    {this.formCells()}
                </div>
                <div style={{ margin: 'auto', width: '700px' }}>

                    <div id='game-buttons-div'>
                        {this.formGameOptions()}
                    </div>

                    <div id='options-div'>
                        <div className='text-in-options-div'>Grid sizes: &nbsp;</div>
                        <div id='sizeButtonsDiv' className='buttons-div'>
                            {this.formSizeOptions()}
                        </div>
                        <div className='text-in-options-div'>Simulation speed: &nbsp;</div>
                        <div className='buttons-div'>
                            {this.formSpeedOptions()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}