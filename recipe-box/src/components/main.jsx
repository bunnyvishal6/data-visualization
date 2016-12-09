import React from 'react';

export default class Application extends React.Component {
    constructor() {
        super();
        this.state = {
            recipes: [
                { name: 'Pumpkin Pie', ingredients: ['Pumpkin Puree', 'Sweetened Condensed Milk', 'Eggs', 'Pumpkin Pie Spice', 'Pie Crust'] },
                { name: 'Spaghetti', ingredients: ['Noodles', 'Tomato Sauce', '(Optional) Meatballs'] },
                { name: 'Onion Pie', ingredients: ['Onion', 'Pie Crust', 'Sounds Yummy right?'] }
            ]
        };
    }

    createMarkup(elements) {
        return { __html: elements };
    }

    /*A method to create panels for accordian*/
    createAccordion(array) {
        let Accordion = [];
        /**Loop through each element of array to create panel from each element*/
        for (let i = 0; i < array.length; i++) {
            let ingredients = [];
            /**loop through ingredients of current element and push list-group-item into ingredients array */
            for (let k = 0; k < array[i].ingredients.length; k++) {
                ingredients.push(<li key={k} className='list-group-item'>{array[i].ingredients[k]}</li>);
                /**If it is the last ingredients of current recipe/element then push entire panel into Accordion array*/
                if (k == array[i].ingredients.length - 1) {
                    Accordion.push(

                        <div key={i} className="panel panel-default">
                            <div className="panel-heading" role="tab" id={`heading${i}`}>
                                <h4 className="panel-title">
                                    <a role="button" data-toggle="collapse" data-parent="#accordion" href={`#collapse${i}`} aria-expanded="false" aria-controls={`collapse${i}`}>
                                        {array[i].name}
                                    </a>
                                </h4>
                            </div>
                            <div id={`collapse${i}`} className="panel-collapse collapse " role="tabpanel" aria-labelledby={`heading${i}`}>
                                <div className="panel-body">
                                    <h4 className='text-center ingredients-heading'>Ingredients</h4>
                                    <ul className='list-group'>
                                        {ingredients}
                                    </ul>
                                    <div className='text-right'>
                                        <button className='btn btn-md btn-info' type='button'>Edit</button>&nbsp;
                                        <button className='btn btn-md btn-danger' type='button'>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    );
                    /**If this is the last recipe/element then return the accordian array which consists of group of panels*/
                    if (i == array.length - 1) {
                        return Accordion;
                    }
                }
            }
        }
    }


    render() {
        return (
            <div className='container'>

                <h2 className='text-center text-primary'>Recipe Box</h2>
                <div className='text-center'>
                    <button type="button" className="btn btn-success btn-md" data-toggle="modal" data-target="#myModal">Add recipe</button>
                </div>

                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h3 className="modal-title text-center">Add a recipe</h3>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className='form-group'>
                                        <label>Recipe name</label>
                                        <input className='form-control' placeholder='Name ...' />
                                    </div>
                                    <div className='form-group'>
                                        <label>Ingredients</label>
                                        <textarea className='form-control' placeholder='Ingredients ...' />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success">Add</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='well' id='accordion-frame'>
                    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        {this.state ? this.createAccordion(this.state.recipes) : null}
                    </div>
                </div>

            </div>
        );
    }
}