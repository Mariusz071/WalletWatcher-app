import '../styles/index.scss';

let dataController = (function() {

    class Expense {
        constructor(id, description, value) {
            this.id = id,
            this.description = description,
            this.value = value
        }
    }

    class Income {
        constructor(id, description, value) {
            this.id = id,
            this.description = description,
            this.value = value
        }
    }


    let data = {
        allValues: {
            expense: [],
            income: []
        },
        totalValues: {
            expense: 0,
            income: 0
        }
    }

    return  {
        addItem: function(type, descr, val) {
            let newItem, ID;

            //create new ID, check if array is empty
            if (data.allValues[type].length > 0) {
                ID = data.allValues[type][data.allValues[type].length - 1].id + 1;
            } else ID = 0;
            
            //create new list entry based on the type input
            if( type === 'expense' ) {
                newItem = new Expense(ID, descr, val)
            } else if ( type === 'income' )  {
                newItem = new Income(ID, descr, val);
            }
            
            //push new created item to the datas tructure
            data.allValues[type].push(newItem);

            // return newItem element
            return newItem;
        },
        testData: function () {
            console.log(data);
        }
    }
} )()

let uiController = (function() {
    //class names in case we have to change them
    let DOMelements = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    //public methods / variables object
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMelements.inputType).value,
                description: document.querySelector(DOMelements.inputDescription).value,
                value: document.querySelector(DOMelements.inputValue).value,
            };
        },
        getDOMelements: function() {
            return DOMelements;
        },

        addListItem: function(object, type) {
            let html, newHtml, listElement;
            // create html string with placeholders
            if( type === 'income') {
                listElement = DOMelements.incomeContainer;
                html = `<div class="item clearfix" id="income-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn">
                                        <i class="ion-ios-close-outline"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`
            } else if ( type === 'expense' ) {
                listElement = DOMelements.expensesContainer;
                html = `<div class="item clearfix" id="expense-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                <div class="item__percentage">%50%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn">
                                        <i class="ion-ios-close-outline"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`
            }
            

            // replace placeholders with the data
            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);

            // insert html into the DOM (as last child element of the list container)
            document.querySelector(listElement).insertAdjacentHTML('beforeend', newHtml);
        },
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
        let input, newItem;
        //1. get input data
        input = uiController.getInput();
        data.testData();

        //2. add item to budget controller
        newItem = dataController.addItem(input.type, input.description, input.value);
        console.log(newItem);

        //3. Add new item to ui
        uiController.addListItem(newItem, input.type);

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




