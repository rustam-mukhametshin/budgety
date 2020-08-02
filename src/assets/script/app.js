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
        // 1. get input data
        var input = UICtrl.getInput();

        // 2. add time to bg ctrl

        // 3. add new item to ui

        // 4. calc bdg

        // 5. display bdg
    }

    return {
        init: function () {
            console.log('Application has started.');

            setupEventListeners();
        }
    }

}(budgetController, UIController));

controller.init();
