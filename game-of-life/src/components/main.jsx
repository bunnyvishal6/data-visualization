import React from 'react';

export default class Application extends React.Component {
    constructor() {
        super();
        this.size = {
            small: { cellSide: 10, gridColums: 50, gridRows: 30 },
            medium: { cellSide: 10, gridColums: 70, gridRows: 50 },
            large: { cellSide: 8, gridColums: 100, gridRows: 80 }
        }
        this.state = { size: this.size.medium };
        /*
        this.gridColums = 70;
        this.gridRows = 50;
        */
        //this.gridWidth = (this.cellSide * this.gridColums) + this.gridColums + 1; /**gridColums added to width as 1px border-right is used. And 1px added to colums as the first column will get 1px border-right*/
        //this.gridHeight = (this.cellSide * this.gridRows) + this.gridRows + 1;  /**gridColums added to height as 1px border-bottom is used. And 1px added to rows as the first row will get 1px border-top*/

    }

    createMarkup(elements) {
        return { __html: elements };
    }

    createGrid(rows, columns) {
        /**create a grid with number of arrays equal to number of rows. 
         * Each array consists of number of elements equal to columns and each element will have 0 or one randomly.
         * Also create gridWithHtmlElements*/
        this.grid = [];
        this.gridWithHtmlElements = [];
        let zeros = 0;
        let ones = 0;
        for (let i = 0; i < rows; i++) {
            this.grid.push([]);
            for (let k = 0; k < columns; k++) {
                /**style for cell elements*/
                let cellBorder = '.5px solid #088A04';
                let cellStyle = {
                    height: `${this.state.size.cellSide}px`,
                    width: `${this.state.size.cellSide}px`,
                    borderRight: cellBorder,
                    borderBottom: cellBorder
                };
                if (i == 0) {
                    cellStyle.borderTop = cellBorder;
                }
                if (k == 0) {
                    cellStyle.borderLeft = cellBorder;
                }
                /**get a random number */
                let randomNum = Math.random();
                let younger = '#F78787', older = '#D50B0B';
                /**Decide whether a cell is live or dead based on this random number */
                if (randomNum > 0.95) {
                    this.grid[i].push([1]);
                    cellStyle.backgroundColor = older;
                    ones += 1;
                } else if (randomNum < 0.95 && randomNum > 0.90) {
                    this.grid[i].push([1]);
                    cellStyle.backgroundColor = younger;
                } else {
                    this.grid[i].push([0]);
                    zeros += 1;
                }
                /**push the cell div into this.gridWithHtmlElements array*/
                this.gridWithHtmlElements.push(<div key={this.gridWithHtmlElements.length.toString()} className='cell' style={cellStyle}></div>);
                if ((i == rows - 1) && (k == columns - 1)) {
                    console.log(`zeros are ${zeros} and ones are ${ones}`);
                    console.log('gridWithHtmlElements length is ' + this.gridWithHtmlElements.length);
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
            return this.gridWithHtmlElements;
        }
    }


    changeSize(e){
        let size = e.target.attributes.getNamedItem('data-gridSize').value;
        this.setState({size: this.size[size]});
    }


    render() {
        return (
            <div className='container'>
                <h1 id='heading' className='text-center'>Game of life</h1>
                <div style={{ height: (this.state.size.cellSide * this.state.size.gridRows) + this.state.size.gridRows + 1 + 'px', width: (this.state.size.cellSide * this.state.size.gridColums) + this.state.size.gridColums + 1 + 'px' }} id='game-grid'>
                    {this.formCells()}
                </div>
                <div id='options-div'>
                    <div style={{marginBottom: '10px'}}>
                        <div className='text-in-options-div'>Grid sizes: &nbsp;</div>
                        <div className='buttons-div'>
                            <button data-gridSize='small' onClick={this.changeSize.bind(this)} className='size-btn btn'>Small</button>&nbsp;
                            <button data-gridSize='medium' onClick={this.changeSize.bind(this)} className='size-btn btn'>Medium</button>&nbsp;
                            <button data-gridSize='large' onClick={this.changeSize.bind(this)} className='size-btn btn'>Large</button>
                        </div>
                    </div>
                    <div>
                        <div className='text-in-options-div'>Simulation speed: &nbsp;</div>
                        <div className='buttons-div'>
                            <button className='speed-btn btn'>Slow</button>&nbsp;
                            <button className='speed-btn btn'>Medium</button>&nbsp;
                            <button className='speed-btn btn'>Fast</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}