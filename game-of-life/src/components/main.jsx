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
        this.state = { size: this.size.medium };

    }

    createMarkup(elements) {
        return { __html: elements };
    }

    createGrid(rows, columns) {
        /**create a grid with number of arrays equal to number of rows. 
         * Each array consists of number of elements equal to columns and each element will have 0 or one randomly.
         * Also create gridHtmlElements*/
        this.grid = [];
        this.gridHtmlElements = [];
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
                if (i == 0) { /**if it is first row then add border-top */
                    cellStyle.borderTop = cellBorder;
                }
                if (k == 0) { /**if it is first column then add border-left */
                    cellStyle.borderLeft = cellBorder;
                }
                /**get a random number */
                let randomNum = Math.random();
                let younger = '#F78787', older = '#D50B0B';
                /**Decide whether a cell is live or dead based on this random number */
                if (randomNum > 0.95) {
                    this.grid[i].push([1]);
                    cellStyle.backgroundColor = younger;
                } else {
                    this.grid[i].push([0]);
                }
                /**push the cell div into this.gridHtmlElements array*/
                this.gridHtmlElements.push(<div key={this.gridHtmlElements.length.toString()} className='cell' style={cellStyle}></div>);
                if ((i == rows - 1) && (k == columns - 1)) {
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
            return this.gridHtmlElements;
        }
    }

    formGameOptions(){
        let gameOptions = ['Play', 'Pause', 'Clear'], gameOptionsHtmlElements=[];
        for(let i=0; i<gameOptions.length; i++){
            let option = gameOptions[i];
            gameOptionsHtmlElements.push(
                <span key={option}>
                    <button className='btn game-btn'>{option}</button>&nbsp;
                </span>
            );
            if( i== gameOptions.length - 1){
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
            this.setState({ size: this.size[sizeName] });
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