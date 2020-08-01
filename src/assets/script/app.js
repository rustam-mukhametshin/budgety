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

}());


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {


    // Some code

    return {
        init: function () {
            console.info('Application has started.');
        }
    }

}(budgetController, UIController));

controller.init();
