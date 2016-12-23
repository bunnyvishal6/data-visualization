import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

let grid = [];
let size = {};
let paused = false;
let generations = 0;
let gameStatus = '';
let delay = 50;

let sizes = {
    small: {
        name: 'small',
        cellSide: 10,
        gridColumns: 50,
        gridRows: 30
    },
    medium: {
        name: 'medium',
        cellSide: 10,
        gridColumns: 70,
        gridRows: 50
    },
    large: {
        name: 'large',
        cellSide: 8,
        gridColumns: 100,
        gridRows: 80
    }
};

let ReactComponents = [];

function createGrid(size) { /**generate grid with specified size */
    let rows = size.gridRows,
        columns = size.gridColumns;
    let newGrid = [];
    for (let i = 0; i < rows; i++) {
        newGrid[i] = [];
        for (let k = 0; k < columns; k++) {
            newGrid[i][k] = {
                age: '',
                value: 0
            };

            if (i == rows - 1 && k == columns - 1) {
                return newGrid;
            }
        }
    }
}

function createGridWithRandomLife(size) { /**to generate a grid with random live cells */
    let rows = size.gridRows,
        columns = size.gridColumns;
    let newGrid = [];
    for (let i = 0; i < rows; i++) {
        newGrid[i] = [];
        for (let k = 0; k < columns; k++) {
            let randomNum = Math.random();
            if (randomNum < 0.75) {
                newGrid[i][k] = {
                    age: '',
                    value: 0
                };
            } else {
                newGrid[i][k] = {
                    age: 'child',
                    value: 1
                };
            }
            if (i == rows - 1 && k == columns - 1) {
                return newGrid;
            }
        }
    }
}

function createGridHtml() {
    $('#grid').empty(); /**empty the grid */

    class ReactCells extends React.Component { /**react class for grid and gridCells */
        constructor() {
            super();
        }

        createCellsHtml(cells) {
            let cellsHtml = [];
            for (let i = 0; i < cells.length; i++) {
                for (let k = 0; k < cells[i].length; k++) {
                    /**style for cell elements*/
                    let younger = '#F78787',
                        older = '#D50B0B';
                    let cellBorder = '.5px solid #088A04';
                    let cellStyle = {
                        height: this.props.size.cellSide + 'px',
                        width: this.props.size.cellSide + 'px',
                        borderRight: cellBorder,
                        borderBottom: cellBorder
                    };
                    if (i == 0) { /**if it is first row then add border-top */
                        cellStyle.borderTop = cellBorder;
                    }
                    if (k == 0) { /**if it is first column then add border-left */
                        cellStyle.borderLeft = cellBorder;
                    }
                    if (cells[i][k].value == 1) { /**if the cell is live */
                        if (cells[i][k].age == 'child') { /**if live cell is child */
                            cellStyle.backgroundColor = younger;
                        } else { /**live cell is not child */
                            cellStyle.backgroundColor = older;
                        }
                    } else { /**cell is not live */
                        cellStyle.backgroundColor = 'black';
                    }
                    cellsHtml.push(
                        <div id={i + '-' + k} key={i + '-' + k} className='cell' style={cellStyle}></div>
                    );
                    if (i == cells.length - 1 && k == cells[i].length - 1) { /**if the iteration comes to an end return cellsHtml */
                        return cellsHtml;
                    }
                }
            }
        }

        render() {
            let cells = this.props.grid.map(row => row);
            let cellsHtml = this.createCellsHtml(cells);
            return (
                <div style={{ height: (this.props.size.cellSide * this.props.size.gridRows) + this.props.size.gridRows + 1 + 'px', width: (this.props.size.cellSide * this.props.size.gridColumns) + this.props.size.gridColumns + 1 + 'px' }} id='game-grid'>
                    {cellsHtml}
                </div>
            );
        }
    }

    ReactComponents[0] = ReactCells;
    drawGridHtml();
};

function drawGridHtml() {
    let ReactCells = ReactComponents[0];
    ReactDOM.render(<ReactCells grid={grid} size={size} />, document.getElementById('grid'));
}

function activateBoard() {
    $('.cell').click(function () {
        let id = $(this).attr('id').split('-');
        let i = +id[0], k = +id[1];
        if (grid[i][k].age) { /**if the cell is alive*/
            grid[i][k] = { age: '', value: 0 };
        } else { /** cell is not alive */
            grid[i][k] = { age: 'child', value: 1 };
        }
        drawGridHtml();
    });
}

function clear() {
    paused = true; /**pause the game */
    grid = [];/**clear grid */
    gameStatus = ''; /**set game status to nill */
    grid = createGrid(size); /**create new grid */
    generations = 0; /**empty the generations */
    drawGridHtml(); /**redraw grid */
    setTimeout(() => {
        $("#generations").html('0'); /**display 0 generations */
        $('.game-btn').css({ 'background-color': '#4B8CCC', 'border': '1px solid #4B8CCC' });
    }, 200);
}

function passGenerations() {
    $("#generations").html(generations); /**display genertions*/
    let newGrid = [], liveCells = 0;
    for (let i = 0; i < grid.length; i++) {
        newGrid[i] = []; /**insert row into new grid */
        for (let k = 0; k < grid[i].length; k++) {
            /**define neighbour rows and cloumns. Check if the row number is greater than 0 and less than max rows number 
             * and column number is greater than zero and less than max column number
             */
            let topRow = (i - 1) < 0 ? (grid.length - 1) : (i - 1), /**if the top row is less than zero row then make top row equal to bottom row */
                sameRow = i,
                bottomRow = (i + 1) < grid.length ? (i + 1) : 0, /**if the bottom row is greater than the maximum of rows then make it equal to top row*/
                leftColumn = (k - 1) < 0 ? (grid[i].length - 1) : (k - 1), /**if left column is less than 0 then leftColumn is equal to max right column */
                sameColumn = k,
                rightColumn = (k + 1) < grid[i].length ? (k + 1) : 0 /**if the right column is greater than the max right column then make it equal to 0 column */
            /**define neighbours */
            let neighbours = [
                [topRow, leftColumn], [topRow, sameColumn], [topRow, rightColumn],
                [sameRow, leftColumn], [sameRow, rightColumn],
                [bottomRow, leftColumn], [bottomRow, sameColumn], [bottomRow, rightColumn]
            ];
            let neighbourStrength = 0;
            neighbours.forEach(n => {
                if (grid[n[0]][n[1]].value == 1) {
                    neighbourStrength += 1;
                }
            });

            if (grid[i][k].age) { /**if the cell is alive no matter adult or child */
                if (neighbourStrength > 1 && neighbourStrength < 4) { /**if neighbour strength is enough to live on next generation */
                    newGrid[i][k] = { age: 'adult', value: 1 }; /**push the result adult to new grid */
                    liveCells += 1;
                } else { /**neighbourStrength is less or more than required means the cell should die. */
                    newGrid[i][k] = { age: '', value: 0 }; /**push the result dead to new grid */
                }
            } else { /**if the cell is a dead cell */
                if (neighbourStrength === 3) { /**if the neighbourStrength is 3 means chance for new life */
                    newGrid[i][k] = { age: 'child', value: 1 }; /**push the result child to new grid */
                    liveCells += 1;
                } else { /**no chance for new life */
                    newGrid[i][k] = { age: '', value: 0 }; /**push the result dead to new grid */
                }
            }

            if (i == grid.length - 1 && k == grid[i].length - 1) { /**if iteration comes to an end */
                grid = newGrid;
                drawGridHtml();
                if (liveCells == 0) { /**if there are no live cells clear then game */
                    $('#generations').html('0');
                    clear();
                } else if (!paused) { /**if liveCells more than 0 and game is not paused then continue*/
                    generations += 1; /**increment generation */
                    setTimeout(() => {
                        passGenerations();
                    }, delay);
                }
            }
        }
    }
}

function play() {
    paused = false; /**remove pause state */
    passGenerations();
    gameStatus = 'play';
}

$(document).ready(function () {
    size = sizes.small; /**set initial size */
    $("#fast, #" + size.name).css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' }); /**highligh default options */
    grid = createGridWithRandomLife(size); /**createGrid with random live cells*/
    createGridHtml(); /**createGrid grid's html  */
    activateBoard();
    play(); /**auto play on page load */
    $("#play").css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' });

    $('#play').click(function () {
        if (gameStatus !== 'play') { /**if game status is not playing then play */
            play();
            $('.game-btn').css({ 'background-color': '#4B8CCC', 'border': '1px solid #4B8CCC' });
            $(this).css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' });
        }
    });

    $("#pause").click(function () { /**if game status is not paused */
        if (gameStatus !== 'pause') {
            paused = true;
            gameStatus = 'pause';
            $('.game-btn').css({ 'background-color': '#4B8CCC', 'border': '1px solid #4B8CCC' });
            $(this).css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' });
        }
    });

    $("#clear").click(function () { /**clear */
        $('.game-btn').css({ 'background-color': '#4B8CCC', 'border': '1px solid #4B8CCC' });
        $(this).css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' });
        clear();
    });

    $('.size-btn').click(function () { /**resize grid means stop everything and start resize */
        let newSize = $(this).attr('id');
        if (newSize !== size.name) {
            size = sizes[newSize];
            clear();
            $('.size-btn').css({ 'background-color': '#29BC8D', 'border': '1px solid #29BC8D' });
            $(this).css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' });
        }
    });

    $('.speed-btn').click(function () { /**change the speed */
        $('.speed-btn').css({ 'background-color': '#29BC8D', 'border': '1px solid #29BC8D' });
        $(this).css({ 'background-color': '#DE9E5E', 'border': '1px solid #DE9E5E' });
        let newDelay = $(this).attr('data-delay');
        delay = +newDelay;
        console.log(delay);
    });

});