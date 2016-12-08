import React from 'react';
import marked from 'marked';

export default class Application extends React.Component {
    constructor() {
        super();
        this.state = {
            text: 'Heading\n=======\n\nSub-heading\n-----------\n \n### Another deeper heading\n \nParagraphs are separated\nby a blank line.\n\nLeave 2 spaces at the end of a line to do a  \nline break\n\nText attributes *italic*, **bold**, \n`monospace`, ~~strikethrough~~ .\n\nShopping list:\n\n  * apples\n  * oranges\n  * pears\n\nNumbered list:\n\n  1. apples\n  2. oranges\n  3. pears\n\nThe rain---not the reign---in\nSpain.\n\n *[Bunny Vishal](https://freecodecamp.com/bunnyvishal6)*'
        };
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    createMarkup(text) {
        return { __html: marked(text) };
    }

    render() {
        return (
            <div className="container">
                <h1 id='heading' className='text-center text-primary'>Markdown</h1>
                <div className='row'>
                    <div className='col-md-6'>
                        <textarea className='textarea' value={this.state.text} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className='col-md-6'>
                        <div className='textarea output' dangerouslySetInnerHTML={this.createMarkup(this.state.text)}></div>
                    </div>
                </div>
            </div>
        );
    }
}