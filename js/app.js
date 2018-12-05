import '../styles/index.scss';

let dataController = (function() {
    // private methods / variables
    


    // public methods / variables object
    
} )()


let uiController = (function() {
    //class names in case we have to change them
    let DOMelements = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn'
    }
    
    //public methods / variables object
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMelements.inputType).value,
                description: document.querySelector(DOMelements.inputDescription).value,
                value: document.querySelector(DOMelements.inputValue).value
            };
        },
        getDOMelements: function() {
            return DOMelements;
        }
    };
})();

let appController = (function (data, ui) {

    let initEventListeners = function() {
        let DOM = uiController.getDOMelements();
        let addBtn = document.querySelector(DOM.addButton);
        addBtn.addEventListener('click', addItem);
        document.addEventListener('keypress', function (e) {
            if(e.keyCode === 13) {
                addItem();
            }
        });
    }

    let addItem = function() {
        //1. get input data
        let input = uiController.getInput();
        console.log(input);

        //2. add item to budget controller
        //3. Add new item to ui
        //4. Calculate the budget
        //5. Display the budget in UI
    };

    return {
        init: function() {
            console.log('App has started');
            initEventListeners();
        }
    };
})(dataController, uiController);

//init function for the App
appController.init();




