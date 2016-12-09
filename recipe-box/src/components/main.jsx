import React from 'react';

export default class Application extends React.Component {
    constructor() {
        super();
        let localRecipes = JSON.parse(localStorage.getItem('recipes'));
        if(localRecipes){
            this.state = {recipes: localRecipes};
        } else{
            let recipes = [
                { name: 'Pumpkin Pie', ingredients: ['Pumpkin Puree', 'Sweetened Condensed Milk', 'Eggs', 'Pumpkin Pie Spice', 'Pie Crust'] },
                { name: 'Spaghetti', ingredients: ['Noodles', 'Tomato Sauce', '(Optional) Meatballs'] },
                { name: 'Onion Pie', ingredients: ['Onion', 'Pie Crust', 'Sounds Yummy right?'] }
            ];
            localStorage.setItem('recipes', JSON.stringify(recipes));
            this.state = {recipes: recipes};
        }
        
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
                                        {/**Here the data-editRefs is used to identify the recipe when its delete button clicked */}
                                        <button data-editRefs={i} className='btn btn-md btn-info' type='button' onClick={this.editRecipe.bind(this)}>Edit</button>&nbsp;
                                        {/**Here the data-closeRefs is used to identify the recipe when its delete button clicked */}
                                        <button data-closeRefs={i} className='btn btn-md btn-danger' onClick={this.delteRecipe.bind(this)} type='button'>Delete</button>
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

     editRecipe(e){
        /**get current recipes to modify the recipes array in state */
        let recipes = this.state.recipes ? this.state.recipes.map(r => r) : [];
        /**Get the current recipe number with data-editRefs attribute */
        let currentRecipeNum = e.target.attributes.getNamedItem('data-editRefs').value;
        /**inject current index into input with id forEdit*/
        document.getElementById('forEdit').value = currentRecipeNum;
        /**Fill the form with previous data of this recipe */
        document.getElementById('newRecipeName').value = recipes[currentRecipeNum].name;
        document.getElementById('newRecipeIngredients').value = recipes[currentRecipeNum].ingredients.join();
        /**remove the current recipe from recipes then set a new state and get the values from form.*/
        recipes.splice(currentRecipeNum, 1);
        /** Open the modal by triggerin a click on add recipe button having a ref */
        this.ModalOpenButton.click();
    }

    delteRecipe(e){
        /**get current recipes to modify the recipes array in state */
        let recipes = this.state.recipes ? this.state.recipes.map(r => r) : [];
        /**Get the current recipe number with data-closeRefs attribute */
        let currentRecipeNum = e.target.attributes.getNamedItem('data-closeRefs').value;
        /**remove the current recipe from recipes then set a new state */
        recipes.splice(currentRecipeNum, 1);
        /**Also need to remove from state directly. */
        this.state.recipes.splice(currentRecipeNum, 1);
        /**Now again set the state to react identify that array is changed */
        this.setState({recipes: recipes});
    }


    handleSubmit(e) {
        e.preventDefault();
        let recipes = this.state.recipes ? this.state.recipes.map(r => r) : [];
        let index = +document.getElementById('forEdit').value;
        /**Checking if forEdit input field has a value greater than zero. If so then the recipe is edited and added to in its previous index else will be pushed into array */
        if( index >= 0){
            /**remove the current recipe from recipes then set a new state and get the values from form.*/
            recipes.splice(index, 1);
            /**Need to manipulate recipes directly from state And no needed of direct manipulation of recipes in state for addition or substraction*/
            this.state.recipes.splice(index, 1);
            recipes.splice(index, 0, {name: document.getElementById('newRecipeName').value, ingredients: document.getElementById('newRecipeIngredients').value.split(',')});
            this.state.recipes.splice(index, 0, {name: document.getElementById('newRecipeName').value, ingredients: document.getElementById('newRecipeIngredients').value.split(',')});
            /**After adding the edited recipe to its old place make the forEdit input value to less than 0 */
            document.getElementById('forEdit').value = -1;
        } else {
            /**Need to manipulate recipes directly from state And no needed of direct manipulation of recipes in state for addition or substraction*/
            recipes.push({name: document.getElementById('newRecipeName').value, ingredients: document.getElementById('newRecipeIngredients').value.split(',')});
            this.state.recipes.push({name: document.getElementById('newRecipeName').value, ingredients: document.getElementById('newRecipeIngredients').value.split(',')});
        }
        this.setState({recipes: recipes});
        this.clearForm();
        /**We need to close the modal after submitting the form. So te following line is to trigger a click event on close button in modal. Used refs in close button element in myModal*/
        this.ModalCloseButton.click();
    }

    clearForm(){
        document.getElementById('newRecipeName').value = '';
        document.getElementById('newRecipeIngredients').value = '';
        document.getElementById('forEdit').value = -1;
    }

    componentWillUpdate(){
        localStorage.setItem('recipes', JSON.stringify(this.state.recipes));
    }

    render() {
        return (
            <div className='container'>

                <h2 className='text-center text-primary'>Recipe Box</h2>
                <div className='text-center'>
                    {/**Here ref is used to manually trigger a open event in editRecipe method */}
                    <button ref={input => this.ModalOpenButton = input} type="button" className="btn btn-success btn-md" data-toggle="modal" data-target="#myModal">Add recipe</button>
                </div>

                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" onClick={this.clearForm.bind(this)}>&times;</button>
                                <h3 className="modal-title text-center">Add a recipe</h3>
                            </div>
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                {/**Below input is used for editing the current recipes. */}
                                <input type='hidden' value='-1' id='forEdit' />
                                <div className="modal-body">
                                    <div className='form-group'>
                                        <label>Recipe name</label>
                                        <input id='newRecipeName' className='form-control' placeholder='Name ...' required />
                                    </div>
                                    <div className='form-group'>
                                        <label>Ingredients</label>
                                        <textarea id='newRecipeIngredients' className='form-control' placeholder='Ingredients ...' required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success">Add</button>
                                    {/**Here ref is used to manually trigger a close event in handleSubmit method */}
                                    <button ref={input => this.ModalCloseButton = input} type="button" className="btn btn-default" data-dismiss="modal" onClick={this.clearForm.bind(this)}>Close</button>
                                </div>
                            </form>
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