/**
 * BUDGET CONTROLLER
 * @public
 */
let budgetController = (function () {

    /**
     * Expense item.
     * @private
     * @param id
     * @param description
     * @param value
     * @constructor
     */
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    /**
     * Calculate percentage.
     * @param totalIncome
     */
    Expense.prototype.calcPercentage = function (totalIncome) {
        this.percentage = totalIncome > 0 ?
            Math.round((this.value / totalIncome) * 100) : -1;
    };

    /**
     * Get percentage.
     * @return {number}
     */
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    /**
     * Income item.
     * @private
     * @param id
     * @param description
     * @param value
     * @constructor
     */
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
        budget: 0,
        percentage: -1
    };

    return {

        /**
         * Add new item (exp|inc) to data.
         * @public
         * @param type
         * @param des
         * @param val
         * @returns {{description: *, id: number, value: number}}
         */
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

            // Calculate the percentage of income that spent
            data.percentage = data.totals.inc > 0 ?
                Math.round((data.totals.exp / data.totals.inc) * 100) : -1;
        },

        /**
         * Calculate percentages.
         * @public
         */
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current, index, array) {
                current.calcPercentage(data.totals.inc);
            });
        },

        /**
         * Get percentages.
         * @public
         * @return {number[]}
         */
        getPercentages: function () {
            return data.allItems.exp.map(current => current.getPercentage());
        },

        /**
         * Get budget data.
         * @public
         * @returns {{percentage: number, totalInc: number, totalExp: number, budget: number}}
         */
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        /**
         * Remove item from data.
         * @public
         * @param type
         * @param id
         */
        deleteItem(type, id) {
            let ids, index;

            // Get only id's
            ids = data.allItems[type]
                .map(current => current.id)

            // Find index of selected id from id's
            index = ids.indexOf(id);

            // Remove from data item object
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        }
    };

}());


/**
 * UI CONTROLLER
 * @public
 */
let UIController = (function () {

    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }

    /**
     * Format numbers.
     * @private
     * @param number
     * @param type
     * @return {string}
     */
    let formatNumber = function (number, type) {
        let numSplit, int, dec, symbol;

        // Absolute int, floating points, split by dot
        // Return string
        numSplit = Math.abs(number)
            .toFixed(2)
            .split('.');

        // Divide numbers
        int = numSplit[0];
        dec = numSplit[1];

        // Add comma if number is greater than 3
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        // Add symbol. For exp or for inc
        symbol = type === 'exp' ? '-' : '+'

        return symbol + ' ' + int + '.' + dec;
    };

    // Loop through all node list
    let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    return {
        /**
         * Get values from inputs.
         * @public
         * @returns {{description: *, type: *, value: number}}
         */
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        /**
         * Add list item (exp|inc) template to DOM.
         * @public
         * @param obj
         * @param type
         */
        addListItem: function (obj, type) {
            let html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id)
                .replace('%description%', obj.description)
                .replace('%value%', formatNumber(obj.value, type));


            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        /**
         * Remove list item from the DOM.
         * @public
         * @param selectorId
         */
        deleteListItem: function (selectorId) {
            document.getElementById(selectorId).remove();
        },

        /**
         * DOM selectors.
         * @public
         * @returns {{inputDescription: string, incomeContainer: string, inputValue: string, inputType: string, inputBtn: string, expensesContainer: string}}
         */
        getDOMStrings: function () {
            return DOMStrings;
        },

        /**
         * Clear input fields.
         * @public
         */
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
        },

        /**
         * Display the budget.
         * @public
         * @param obj
         */
        displayBudget: function (obj) {

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, (
                obj.budget > 0 ? 'inc' : 'exp'
            ));
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            document.querySelector(DOMStrings.percentageLabel).textContent = (
                obj.percentage > 0 ? obj.percentage + '%' : '---'
            );
        },

        /**
         * Update the UI with the new percentages.
         * @public
         * @param percentages
         */
        displayPercentages: function (percentages) {

            // Get all percentage selectors.
            let fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);

            // Insert percentage
            nodeListForEach(fields, function (current, index) {
                current.textContent = percentages[index] > 0 ?
                    percentages[index] + '%' :
                    '---';
            })
        },

        /**
         * Display month and year.
         * @public
         */
        displayDate: function () {
            let now, month, year;

            now = new Date();
            year = now.getFullYear();
            month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(now);

            document.querySelector(DOMStrings.dateLabel).textContent = month + ' ' + year;
        },

        /**
         * Change decoration of inputs and btn
         * when exp/inc selected.
         */
        changedType() {
            let inputs, array;

            inputs = [DOMStrings.inputType, DOMStrings.inputDescription, DOMStrings.inputValue];
            array = document.querySelectorAll(inputs.join(','));

            nodeListForEach(array, function (cur) {
                cur.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        }
    }
}());


/**
 * GLOBAL APP CONTROLLER
 * @public
 * @type {{init: controller.init}}
 */
let controller = (function (budgetCtrl, UICtrl) {

    /**
     * Event listeners for adding new item.
     * @private
     */
    let setupEventListeners = function () {

        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            // Enter and numpadEnter
            if (event.key === 'Enter') {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    }

    /**
     * Calculate and update budget.
     * @private
     */
    let updateBudget = function (type) {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget(type)

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    /**
     * Calculate and update percentages.
     * @private
     */
    let updatePercentages = function () {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    }

    /**
     * Add new item.
     * @private
     */
    let ctrlAddItem = function () {
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

            // 5. Calculate and update budget
            updateBudget(input.type);

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;

        // Todo: Not appropriate.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the budget data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete then item from the UI
            UICtrl.deleteListItem(type + '-' + ID);

            // 3. Update and show the new budget
            updateBudget(type);

            // 4. Calculate and update percentages
            updatePercentages();
        }
    }

    return {

        /**
         * Initializing application.
         * @public
         */
        init: function () {
            console.log('Application has started.');

            // Display month and year.
            UICtrl.displayDate();

            // Display default values of budget
            UICtrl.displayBudget(budgetCtrl.getBudget());

            // Event listeners for adding new item
            setupEventListeners();
        }
    }

}(budgetController, UIController));

/**
 * Run app.
 */
controller.init();
