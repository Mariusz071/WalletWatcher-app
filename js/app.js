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

    let calculateTotals = function(type) {
        let total = 0;
        data.allValues[type].forEach(el => {
            total += el.value;
        });
        data.totalValues[type] = total;
    }

    let data = {
        allValues: {
            expense: [],
            income: []
        },
        totalValues: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
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

            // return newItem element and clear input fields
            uiController.clearInputs();
            return newItem;
            
        },
        testData: function () {
            console.log(data);
        },

        deleteItem: function(type, id) {
            let idsArray, index;
            idsArray = data.allValues[type].map((el, i) => {
                return el.id;
            })

            index = idsArray.indexOf(id);  

            if (index !== -1) {
                data.allValues[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            calculateTotals('expense');
            calculateTotals('income');

            data.budget = data.totalValues.income - data.totalValues.expense;

            if(data.totalValues.income > 0) {
                data.percentage = Math.round((data.totalValues.expense / data.totalValues.income) * 100);
            } else data.percentage = -1;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totalValues.income,
                totalExpenses: data.totalValues.expense,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        listsContainer: '.container'
    }
    
    //public methods / variables object
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMelements.inputType).value,
                description: document.querySelector(DOMelements.inputDescription).value,
                value: parseFloat(document.querySelector(DOMelements.inputValue).value)
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

        deleteListItem: function (selectorID) {
            let el = document.getElementById(selectorID);
            el.parentElement.removeChild(el);
        },

        //clear input fields after adding list item
        clearInputs: function() {
            let inputFields = document.querySelectorAll('input');
            inputFields = [...inputFields];
            inputFields.forEach(el => {
                el.value = '';
            })

            inputFields[0].focus();
        },

        displayBudget: function (object) {
            document.querySelector(DOMelements.budgetLabel).textContent = object.budget;
            document.querySelector(DOMelements.expensesLabel).textContent = object.totalExpenses;
            document.querySelector(DOMelements.incomeLabel).textContent = object.totalIncome;

            if(object.percentage > 0 ) {
                document.querySelector(DOMelements.percentageLabel).textContent = `${object.percentage}%`;
            } else  {
                document.querySelector(DOMelements.percentageLabel).textContent = '---'
            }
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

        document.querySelector(DOM.listsContainer).addEventListener('click', deleteItem);

    };

    let updateBudget = function () {
        //1 calculate
        dataController.calculateBudget();

        //2 return
        let budget = dataController.getBudget();

        //3 display
        uiController.displayBudget(budget);

    }

    let addItem = function() {
        let input, newItem;
        //1. get input data
        input = uiController.getInput();
        data.testData();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. add item to budget controller
            newItem = dataController.addItem(input.type, input.description, input.value);
            console.log(newItem);

            //3. Add new item to ui
            uiController.addListItem(newItem, input.type);
        } 

        //4. Calculate and update the budget
        updateBudget();

    };

    let deleteItem = function(e) {
        let itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete item from data structure
            dataController.deleteItem(type, ID);
            dataController.testData();

            //2. delete item from uiser interface
            uiController.deleteListItem(itemID);

            //3. update and show the new budget
            updateBudget();
        }
    };

    return {
        init: function() {
            console.log('App has started');

            //setting initial values for 0
            uiController.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: 0,
            });
            initEventListeners();
        }
    };
})(dataController, uiController);

//init function for the App
appController.init();




