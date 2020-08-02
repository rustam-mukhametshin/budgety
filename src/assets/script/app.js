// BUDGET CONTROLLER
var budgetController = (function () {

    let Expense = function (id, description, value) {
        return {
            id: id,
            description: description,
            value: value
        }
    };

    let Income = function (id, description, value) {
        return {
            id: id,
            description: description,
            value: value
        }
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {

            let newItem, ID;

            // Create new ID // Todo: dynamic ID
            ID = 0;

            // Create new item base on 'inc' or 'exp' type
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            // Push it into data structure
            data.allItems[type].push(newItem);
        }
    };

}());


// UI CONTROLLER
var UIController = (function () {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    // Some code
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    }
}());


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function () {

        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            // Enter and numpadEnter
            if (event.key === 'Enter') {
                ctrlAddItem();
            }
        })
    }

    var ctrlAddItem = function () {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, +input.value);

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    return {
        init: function () {
            console.log('Application has started.');

            setupEventListeners();
        }
    }

}(budgetController, UIController));

controller.init();
