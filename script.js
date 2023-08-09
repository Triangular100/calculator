function pressNumber(e) {
    appendNumber(e.target.textContent);
}

function appendNumber(value) {
    if (!validNumberAppend(value)) {
        return;
    }
    if (existsLastNumber() === "0") {
        currentExpression = removeLastDigit(currentExpression);
    }
    currentExpression += value;
    result = calculateExpression(currentExpression);
    drawDisplay();
}

function validNumberAppend(value) {
    if (Number(value) > 0) {
        return true;
    }
    let lastNumber = existsLastNumber();
    if (lastNumber === "0" && value === "0") {
        return false;
    }
    return true;
}

function existsLastNumber() {
    // returns the last number if there is a last number
    if (currentExpression === "") {
        return "";
    }
    if (Number.isFinite(Number(currentExpression))) {
        return currentExpression;
    }
    // Match to last number if it exists
    let lastNumber = currentExpression.match(/\d*[.]?\d*$/);
    if (lastNumber) {
        return lastNumber[0];
    }
    return "";
}

function pressOperate(e) {
    let operator = e.target.getAttribute("data-value");
    appendOperator(operator);
}

function appendOperator(operator) {
    if (currentExpression === "" && operator === "-") {
        currentExpression += `${operator}`;
        drawDisplay();
        return;
    }
    if (currentExpression === "") {
        return;
    }
    // don't operate on negative sign
    if (currentExpression === "-") {
        return;
    }
    let lastOperator = existsLastOperator();
    if (lastOperator === operator) {
        return;
    }
    // don't operate on . (needs more digits)
    let lastNumber = existsLastNumber();
    if (lastNumber === ".") {
        return;
    }
    // replace operator
    if (lastOperator) {
        currentExpression = removeLastOperator(currentExpression);
    }
    result = calculateExpression(currentExpression);
    currentExpression += ` ${operator} `;
    drawDisplay();
}

function existsLastOperator() {
    // Returns the the operator at the end if there is one at the end
    if (currentExpression === "") {
        return "";
    }
    if (existsLastNumber()) {
        return "";
    }
    return currentExpression[currentExpression.length - 2];
}

function pressReset() {
    currentExpression = "";
    result = "";
    drawDisplay();
}

function backspace() {
    if (currentExpression === "") {
        return;
    }
    // Either at a number or operator
    let lastNumber = existsLastNumber();
    if (lastNumber) {
        currentExpression = removeLastDigit(currentExpression);
        updateResult();
    } else {
        currentExpression = removeLastOperator(currentExpression);
    }
    drawDisplay();
}

function removeLastDigit(expression) {
    return expression.substring(0, expression.length - 1);
}

function removeLastOperator(expression) {
    return expression.substring(0, expression.length - 3);
}

function updateResult() {
    if (currentExpression === "") {
        result = "";
        return;
    }
    lastNumber = existsLastNumber();
    if (lastNumber === ".") {
        // Remove the period and the operator before it
        result = calculateExpression(removeLastOperator(removeLastDigit(currentExpression)));
        return;
    }
    if (lastNumber) {
        result = calculateExpression(currentExpression);
        return;
    }
    // no last number means there's an operator
    result = calculateExpression(removeLastOperator(currentExpression));
}

function calculate() {
    let lastNumber = existsLastNumber();
    if (lastNumber === "" || lastNumber === ".") {
        return;
    }
    result = "";
    currentExpression = calculateExpression(currentExpression);
    currentExpression = truncate(currentExpression);
    drawDisplay();
}

function truncate(expression) {
    let limit = 15;
    if (expression.length < limit) {
        return expression;
    }
    if (currentExpression.includes("e")) {
        let exponent = currentExpression.substring(currentExpression.indexOf("e"));
        let left = limit - exponent.length;
        currentExpression = currentExpression.substring(0, left) + exponent;
        return currentExpression;
    }

    return currentExpression.substring(0, 15);
}

function addPeriod() {
    if (existsLastNumber().includes(".")) {
        return;
    }
    currentExpression += ".";
    drawDisplay();
}

function drawDisplay() {
    expressionDisplay.textContent = currentExpression;
    resultDisplay.textContent = result;
}

function calculateExpression(expression) {
    if (expression === "" || expression === "-" || expression === ".") {
        return "";
    }
    // Precedence: exponent, (multiplication, division, modulus), (add, subtract)
    while (expression.includes("^")) {
        expression = simplifyFirst(expression, "^");
    }
    while (expression.includes("*") || expression.includes("/") || expression.includes("%")) {
        let operator = identifyFirstOperator(expression, ["*", "/", "%"]);
        expression = simplifyFirst(expression, operator);
    }
    while (expression.includes("+") || expression.includes("-")) {
        if (Number.isFinite(Number(expression))) {
            break;  // expression can be negative, like -3
        }
        // remove first digit to account for possibility of first number negative
        let operator = identifyFirstOperator(expression.substring(1), ["+", "-"]);
        expression = simplifyFirst(expression, operator);
    }
    return String(Number(expression));
}

function identifyFirstOperator(expression, operators) {
    let first = "";
    let lowestIndex = Infinity;
    operators.forEach(operator => {
        let index = expression.indexOf(operator);
        if (index >= 0 && index < lowestIndex) {
            first = operator;
            lowestIndex = index;
        }
    });
    return first;
}

function simplifyFirst(expression, operator) {
    let subterms = parseFirstSubterms(expression, operator);
    let [num1, num2] = parseNumbers(subterms, operator);
    let output = "";
    if (operator === "+") {
        output = num1 + num2;
    } else if (operator === "-") {
        output = num1 - num2;
    } else if (operator === "*") {
        output = num1 * num2;
    } else if (operator === "/") {
        output = num1 / num2;
    } else if (operator === "^") {
        output = Math.pow(num1, num2);
    } else if (operator === "%") {
        output = num1 % num2;
    }
    return expression.replace(subterms, output);
}

function parseFirstSubterms(expression, operator) {
    // Account for negative sign if operator is a minus
    let minus = "";
    if (operator === "-" && expression[0] === "-") {
        expression = expression.substring(1);
        minus = "-";
    }

    // Operator always has a space on each side
    let index = expression.indexOf(operator);
    let leftIndex = index - 2;
    let rightIndex = index + 2;

    while (leftIndex >= 0 && !(expression[leftIndex] === " ")) {
        leftIndex--;
    }
    while (rightIndex < expression.length && !(expression[rightIndex] === " ")) {
        rightIndex++;
    }

    return minus + expression.substring(leftIndex + 1, rightIndex);
}


function parseNumbers(expression, operator) {
    let [num1, num2] = expression.split(` ${operator} `);
    return [Number(num1), Number(num2)];
}

function processKey(e) {
    if (e.key === " ") {
        return;
    } else if (Number.isInteger(Number(e.key))) {
        appendNumber(e.key);
    } else if (e.key === "Backspace") {
        backspace();
    } else if (e.key === "%" ||
        (e.key === "^") ||
        (e.key === "/") ||
        (e.key === "*") ||
        (e.key === "-") ||
        (e.key === "+")) {
        appendOperator(e.key);
        e.preventDefault(); // Prevent FireFox Quick Find
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === ".") {
        addPeriod();
    }
}

let result = "";
let currentExpression = "";

const numberButtons = document.querySelectorAll(".number");
const operateButtons = document.querySelectorAll(".operate");
const resetButton = document.querySelector("#reset");
const backspaceButton = document.querySelector("#backspace");
const equalButton = document.querySelector("#equal");
const periodButton = document.querySelector("#period");
const resultDisplay = document.querySelector(".result");
const expressionDisplay = document.querySelector(".expression");

numberButtons.forEach(button => button.addEventListener("click", pressNumber));
operateButtons.forEach(button => button.addEventListener("click", pressOperate));
resetButton.addEventListener("click", pressReset);
backspaceButton.addEventListener("click", backspace);
equalButton.addEventListener("click", calculate);
periodButton.addEventListener("click", addPeriod);

window.addEventListener("keydown", processKey);
