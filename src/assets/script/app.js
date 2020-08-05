// BUDGET CONTROLLER
var budgetController = (function () {

    /**
     * Private constructor for Expense.
     * @param id
     * @param description
     * @param value
     * @returns {{description: *, id: number, value: number}}
     * @constructor
     */
    let Expense = function (id, description, value) {
        return {
            id: id,
            description: description,
            value: value
        }
    };

    /**
     * Private constructor for Income.
     * @param id
     * @param description
     * @param value
     * @returns {{description: *, id: number, value: number}}
     * @constructor
     */
    let Income = function (id, description, value) {
        return {
            id: id,
            description: description,
            value: value
        }
    };

    /**
     * Calculate total income and expenses.
     * @private
     * @param type
     * @returns {{allItems: {exp: [], inc: []}, percentage: number, totals: {exp: number, inc: number}, budget: number}}
     */
    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (current, index, array) {
            sum += current.value;
        });

        data.totals[type] = sum;

        return data;
    };

    /**
     * Budget data.
     * @private
     */
    let data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0
    };

    return {
        addItem: function (type, des, val) {

            let newItem, ID;

            // Create new ID
            ID = data.allItems[type].length > 0 ?
                data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

            // Create new item base on 'inc' or 'exp' type
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            // Push it into data structure
            data.allItems[type].push(newItem);
            data.totals[type] += val;

            // Return the new element
            return newItem;
        },

        /**
         * Calculate budget.
         * @public
         * @param type
         */
        calculateBudget: function (type) {

            // Calculate total income and expenses
            calculateTotal(type);

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
        }
    };

}());


// UI CONTROLLER
var UIController = (function () {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    }

    // Some code
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            let html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = `
                    <div class="item clearfix" id="income-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">+ %value%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = `
                  <div class="item clearfix" id="expense-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">- %value%</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
             `;
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id)
                .replace('%description%', obj.description)
                .replace('%value%', obj.value);


            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        getDOMStrings: function () {
            return DOMStrings;
        },
        clearFields: function () {
            let fields, fieldsArray;

            fields = document.querySelectorAll(
                DOMStrings.inputDescription + ', ' +
                DOMStrings.inputValue
            );

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = '';
            })

            fieldsArray[0].focus();
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

        if (
            input.description !== '' &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();
        }

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
