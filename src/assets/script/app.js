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

    let DOM = UICtrl.getDOMStrings();

    return {
        init: function () {
            console.info('Application has started.');
        }
    }

}(budgetController, UIController));

controller.init();
