// BUDGET CONTROLLER
var budgetController = (function () {

    // Some code

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
        getDOMStrings: function () {
            return DOMStrings;
        }
    }
}());


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function () {

        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', function () {
        });

        document.addEventListener('keypress', function (event) {

            // Enter and numpadEnter
            if (event.key === 'Enter') {

            }
        })
    }

    return {
        init: function () {
            console.log('Application has started.');

            setupEventListeners();
        }
    }

}(budgetController, UIController));

controller.init();
